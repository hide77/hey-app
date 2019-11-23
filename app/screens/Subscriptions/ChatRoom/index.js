import React from "react";
import {
  Share,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  View
} from "react-native";
import { pop, push, tabPush } from "hey-screens/navigation";
import UserPicture from "hey-components/UserPicture";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as chatActions from "hey-redux/actions/chat";
import {
  reportPost,
  reportUser,
  blockUser
} from "hey-redux/actions/moderation";
import { getSiteId } from "hey-redux/actions/entries";
import { getUser } from "hey-redux/actions/user";
import { subscribe, unsubscribe } from "hey-redux/actions/subscriptions";
import HeyActionSheet from "hey-mocks/HeyActionSheet";
import { idx } from "hey-mocks/helper";
import { FULL_SOCKET } from "hey-mocks";
import { getData, storeData } from "hey-mocks/AsyncStore";
import Footer from "hey-components/InputFooter";
import Message from "hey-components/Message";
import { Wrapper } from "hey-components/Common";
import Header from "hey-components/Header";
import { SwipeListView } from "react-native-swipe-list-view";
import _ from "lodash";
import { withTheme } from "hey-theme";

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 1,
      loading: true,
      openedMessage: null,
      roomName: "",
      roomId: null
    };
    this.scrollViewRef;
  }

  componentDidUpdate(prevProps, prevState) {
    let _roomName = `${
      idx(["is_hashtag"], this.props.chat.host) ? "#" : ""
    }${idx(["host"], this.props.chat.host, "")}`;
    if (
      this.state.roomName !== _roomName &&
      idx(["host"], this.props.chat.host)
    ) {
      this.setState({
        roomName: _roomName,
        roomId: idx(["id"], this.props.chat.host)
      });
    }
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.initSubscription(
      this.props.stateParams.id,
      this.props.stateParams.host
    );
  }

  componentWillUnmount() {
    console.log("component unmount");
    if (!FULL_SOCKET) {
      this.offSocket();
    }
  }

  offSocket() {
    if (!FULL_SOCKET) {
      this.props.chat.socket.off("deletedMessage");
      this.props.chat.socket.off("message");
      this.props.chat.socket.off("userJoined");
      this.props.chat.socket.off("userLeft");
      this.props.chat.socket.emit("leave");
    }
  }

  initSocket(id) {
    if (!FULL_SOCKET) {
      const { socket } = this.props.chat;
      if (socket) {
        socket.on("message", msg => {
          if (!msg) return;
          this.props.appendMessage(msg);
        });
        socket.on("userJoined", data => {
          this.props.updateConnectedUsersCount(data.count);
        });
        socket.on("userLeft", data => {
          this.props.updateConnectedUsersCount(data.count);
        });
        socket.on("deletedMessage", data => {
          this.props.messageDeleted(data.message);
        });
        socket.emit("join", { site: id });
      }
    }
  }

  storeChatroom = id => {};

  fetchChatroom = id => {
    // getData(`chat:${id}`, { json: true }).then(_chatData => {
    //   if (_chatData) {
    //     this.props.restoreMessagesHistory(_chatData);
    //   }
    //   this.props.getMessagesHistory(id);
    // });
    this.props.getMessagesHistory(id);
  };
  initSubscription = (id, host) => {
    this.offSocket();
    this.initSocket(id);
    this.fetchChatroom(id);
    this.props.getSite(host, () => {
      this.setState({ loading: false });
    });
  };

  _popToTop = () => {
    pop(this.props.componentId);
  };

  _goToChatRoomSettings = () => {
    tabPush("ChatRoomSettings", {
      data: this.props.chat
    });
  };

  _stateRefresh = () =>
    this.setState(state => ({ refresh: state.refresh + 1 }));

  _scrollToMessage = ({ id, postitionY }) => {
    this.scrollToItem({ index, id, postitionY });
  };

  _onRowOpen = (id, items) => {
    this.replyToUser(items[id].props.item);
  };

  _closeReply = () => {
    this.setState({ openedMessage: null });
  };

  _keyExtractor = (item, index) => item.id;

  _subscribe = () => this.props.subscribe(this.props.stateParams.id);

  _renderHiddenItem = (data, rowMap) => <View />;

  _renderMessages = ({ item, index }) => (
    <View style={styles.rowFront({ theme: this.props.theme })} key={item._id}>
      <Message
        scrollToMessage={this._scrollToMessage}
        message={item}
        myId={this.props.user.result._id}
        push={push}
        parentComponent={this.props.componentId}
        initSubscription={this.initSubscription}
        reportPost={this.props.reportPost}
        reportUser={this.props.reportUser}
        blockUser={this.props.blockUser}
        replyToUser={() => this.replyToUser(item)}
        likeChatMessage={this.props.likeChatMessage}
        deleteChatMessage={this.props.deleteChatMessage}
        setRefresh={this._stateRefresh}
        getSiteId={this.props.getSiteId}
        getUser={this.props.getUser}
      />
    </View>
  );

  replyToUser = item => {
    this.setState({ openedMessage: item });
    this.chatRoomInputFocus();
  };

  getReference(ref) {
    this.scrollViewRef = ref;
  }
  scrollToItem = ({ index, id, postitionY }) => {
    // this.scrollViewRef.scrollTo({ y: 300, animated: true });
  };

  openMenu = (toggleEdit, logoutUser) => {
    HeyActionSheet({
      title: "Menu",
      message: "What do you want to do?",
      actions: [
        {
          title: "Share",
          action: () => {
            Share.share({
              title: "Join the conversation on Hey",
              message: `👋 Hey! ${
                this.state.roomName
              } is trending right now, join me on Hey! https://hey.network`
            });
          }
        },
        {
          title: "Unsubscribe",
          disabled: !idx(["subscribed"], this.props.chat.host),
          destructiveButton: true,
          action: () => {
            Alert.alert(
              "Unsubscribe",
              "Are you sure you want to unsubscribe?",
              [
                {
                  text: "No",
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () => {
                    this.props.unsubscribe(idx(["id"], this.props.chat.host));
                    this.props.navigation.popToTop();
                  }
                }
              ]
            );
          }
        },
        {
          title: "Cancel",
          cancelButton: true
        }
      ]
    });
  };

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
    const username = this.props.user.result.username;
    const href = idx(["host"], this.props.chat.host);

    const messageObject = {
      site: this.state.roomId,
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

    this.props.chat.socket.emit("message", messageObject, _message => {
      if (typeof _cb === "function") {
        _cb();
      }
      if (
        idx(["site", "_id"], _message) &&
        _message.site._id === this.state.roomId
      ) {
        this.props.appendMessage(_message);
        this.setState({ openedMessage: null });
      } else {
        Alert.alert(
          "Error",
          "Could not send your message.. 😅 Are you sure you are connected to the internet? Maybe try again?",
          [
            {
              text: "Ok..",
              onPress: () => {
                // we should setup a bug report thing
              }
            }
          ]
        );
      }
    });
  };

  render() {
    const { chatMessages } = this.props.chat;
    const { theme } = this.props;
    if (
      this.props.chat.isLoading ||
      !this.props.user.result ||
      !this.props.chat.socket ||
      this.state.loading
    )
      return (
        <Wrapper appTheme={theme}>
          <Header
            title=" "
            loading
            actions={[
              {
                postition: "left",
                type: "back",
                onPress: this._popToTop
              }
            ]}
          />
        </Wrapper>
      );

    return (
      <Wrapper appTheme={theme}>
        {this.props.chat.host && (
          <Header
            title={this.state.roomName}
            titlePress={this._goToChatRoomSettings}
            actions={[
              {
                postition: "left",
                type: "back",
                onPress: this._popToTop
              },
              {
                postition: "right",
                renderComponent: (
                  <TouchableOpacity onPress={this._goToChatRoomSettings}>
                    <UserPicture
                      size={30}
                      superStyle={{ marginHorizontal: 10 }}
                      user={{ username: this.props.chat.host.host }}
                    />
                  </TouchableOpacity>
                )
              }
            ]}
          />
        )}
        {chatMessages.length > 0 ? (
          <SwipeListView
            ref={this.getReference.bind(this)}
            style={{ zIndex: -3 }}
            keyboardShouldPersistTaps="never"
            keyboardDismissMode="on-drag"
            useFlatList
            inverted
            extraData={this.state.refresh}
            data={chatMessages}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderMessages}
            renderHiddenItem={this._renderHiddenItem}
            disableRightSwipe={true}
            rightOpenValue={0.01}
            closeOnRowBeginSwipe
            onRowOpen={this._onRowOpen}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <Footer
          private={false}
          InitChatRoomInput={this.InitChatRoomInput}
          submitChat={this.submitChat}
          subscribed={idx(["subscribed"], this.props.chat.host)}
          subscribe={this._subscribe}
          openedMessage={this.state.openedMessage}
          closeReply={this._closeReply}
          roomName={this.state.roomName}
          token={this.props.authentication.token}
        />
      </Wrapper>
    );
  }
}

// ChatRoom.prototype.render = _.throttle(ChatRoom.prototype.render, 20);

export default connect(
  state => ({
    chat: state.chat,
    user: state.user,
    authentication: state.authentication
  }),
  {
    getMessagesHistory: chatActions.getMessagesHistory,
    restoreMessagesHistory: chatActions.restoreMessagesHistory,
    getSite: chatActions.getSite,
    getPrivateMessagesHistory: chatActions.getPrivateMessagesHistory,
    updateConnectedUsersCount: chatActions.updateConnectedUsersCount,
    getUsersCount: chatActions.getUsersCount,
    appendMessage: chatActions.appendMessage,
    resetChatMessages: chatActions.resetChatMessages,
    likeChatMessage: chatActions.likeChatMessage,
    deleteChatMessage: chatActions.deleteChatMessage,
    messageDeleted: chatActions.messageDeleted,
    reportPost,
    reportUser,
    blockUser,
    subscribe,
    unsubscribe,
    getSiteId,
    getUser
  }
)(withTheme(ChatRoom));

const styles = {
  rowFront: ({ theme }) => ({
    alignItems: "center",
    backgroundColor: theme.appBackground,
    justifyContent: "center"
  }),
  rowBack: ({ theme }) => ({
    alignItems: "center",
    backgroundColor: theme.appBackground,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  }),
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
};
