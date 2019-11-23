import React from "react";
import { push, pop, tabPush } from "hey-screens/navigation";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as chatActions from "hey-redux/actions/chat";
import {
  reportPost,
  reportUser,
  blockUser
} from "hey-redux/actions/moderation";
import Footer from "hey-components/InputFooter";
import { idx } from "hey-mocks/helper";
import Message from "hey-components/Message";
import { Host, Toolbar, Wrapper } from "hey-components/Common";
import Header from "hey-components/Header";
import { Loading } from "hey-components/Common/Loading";
import { withTheme } from "hey-theme";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 1,
      openedMessage: null
    };
    this.scrollViewRef;
  }

  // componentWillMount() {
  //   this.focusListener = this.props.navigation.addListener(
  //     "didFocus",
  //     async () => {
  //       // if (this.props.notifications.unreadCount > 0) {
  //       //   this.props.getNotifications({
  //       //     reset: true,
  //       //     log: "componentWillMount",
  //       //     cb: this.props.getCountUnread
  //       //   });
  //       // }
  //     }
  //   );
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chat.socket === undefined && this.props.chat.socket) {
      this.initSocket();
    }
  }

  componentDidMount() {
    const id = this.props.stateParams.id;

    if (id) this.props.getPrivateMessagesHistory(id);

    this.initSocket();
  }

  componentWillUnmount() {
    this.props.chat.socket.off("privateMessage");
    this.props.chat.socket.emit("leave");
  }

  initSocket() {
    const id = this.props.stateParams.id;

    const { socket } = this.props.chat;

    if (socket) {
      socket.on("privateMessage", msg => {
        if (!msg) {
          return;
        }
        msg.user = msg.from;
        this.props.appendPrivateMessage(msg);
      });
    }
  }

  chatRoomInput;
  InitChatRoomInput = input => {
    this.chatRoomInput = input;
  };
  chatRoomInputFocus = () => {
    if (this.chatRoomInput) {
      this.chatRoomInput.focus();
    }
  };

  submitChat = ({ message, imageUri }, _cb) => {
    const user = this.props.stateParams.id;
    const href = this.props.stateParams.host;
    const messageObject = {
      message,
      href,
      tagged_users: [],
      attachements: []
    };
    if (imageUri) {
      messageObject.attachements.push({
        url: imageUri,
        type: "image"
      });
    }
    if (!imageUri && !message) return;
    if (this.state.openedMessage)
      messageObject.reply = this.state.openedMessage.id;
    this.props.chat.socket.emit(
      "privateMessage",
      { message, user },
      _message => {
        _message.user = _message.from;
        this.props.appendPrivateMessage(_message);
        if (typeof _cb === "function") {
          _cb();
        }
      }
    );

    this.setState({ message: "" });
  };

  render() {
    const { theme } = this.props;
    const { privateChatMessages } = this.props.chat;

    if (
      this.props.chat.isLoading ||
      !this.props.user.result ||
      !this.props.chat.socket
    )
      return <Loading appTheme={theme} />;

    return (
      <Wrapper appTheme={theme}>
        <Header
          title={this.props.stateParams.user}
          titlePress={() => {
            tabPush("User", {
              id: this.props.stateParams.id
            });
          }}
          actions={[
            {
              postition: "left",
              type: "back",
              onPress: () => {
                pop(this.props.componentId);
              }
            }
          ]}
        />
        {privateChatMessages.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="never"
            keyboardDismissMode="on-drag"
            inverted
            extraData={privateChatMessages}
            data={privateChatMessages}
            keyExtractor={(item, index) => item.id + item.message}
            renderItem={({ item }) => (
              <Message
                message={item}
                myId={this.props.user.result._id}
                push={push}
                reportPost={this.props.reportPost}
                reportUser={this.props.reportUser}
                blockUser={this.props.blockUser}
                likeChatMessage={this.props.likeChatMessage}
                deleteChatMessage={this.props.deleteChatMessage}
                isPrivate
              />
            )}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <Footer
          private={true}
          InitChatRoomInput={this.InitChatRoomInput}
          submitChat={this.submitChat}
          token={this.props.authentication.token}
        />
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  {
    getMessagesHistory: chatActions.getMessagesHistory,
    getPrivateMessagesHistory: chatActions.getPrivateMessagesHistory,
    updateConnectedUsersCount: chatActions.updateConnectedUsersCount,
    getUsersCount: chatActions.getUsersCount,
    appendPrivateMessage: chatActions.appendPrivateMessage,
    resetChatMessages: chatActions.resetChatMessages,
    likeChatMessage: chatActions.likeChatMessage,
    deleteChatMessage: chatActions.deleteChatMessage,
    reportPost,
    reportUser,
    blockUser
  }
)(withTheme(Chat));
