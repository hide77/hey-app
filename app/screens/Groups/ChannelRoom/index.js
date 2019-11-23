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
import Toast, { DURATION } from "react-native-easy-toast";
import { pop, push, tabPush, openChannelsDrawer } from "hey-screens/navigation";
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
import {
  setCurrentChannel,
  generateShareToken
} from "hey-redux/actions/groups";
import { userInvite } from "hey-services/Groups";
import {
  addToPlaylist,
  delFromPlaylist,
  getPlaylists
} from "hey-redux/actions/playlists";
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
import { HeaderItem } from "hey-components/Header";
import { SwipeListView } from "react-native-swipe-list-view";
import _ from "lodash";
import { withTheme } from "hey-theme";
import { getChannelMessagesResource } from "hey-resources/Channels";
import { joinGroupResource } from "hey-resources/Groups";

class ChannelRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 1,
      channel: "",
      is_member: false,
      loading: true,
      openedMessage: null,
      roomName: "",
      roomId: null
    };
    this.scrollViewRef;
  }

  componentDidMount() {
    this.setState(
      {
        inPlaylists:
          this.props.playlists.channelInPlaylists.indexOf(
            this.props.stateParams.channel._id
          ) > -1,
        loading: true,
        channel: this.props.stateParams.channel,
        group: this.props.stateParams.group,
        is_member: this.props.stateParams.group.is_member
      },
      () => {
        this.initSubscription({
          group_id: this.props.stateParams.group._id,
          channel_id: this.props.stateParams.channel._id
        });
        this._getChatHistory(
          {
            channel_id: this.state.channel._id
          },
          r => {
            // do stuff
            this.setState({
              loading: false,
              channelHistory: r.result
            });
          }
        );
      }
    );
  }

  componentWillUnmount() {
    if (!FULL_SOCKET) {
      this.offSocket({ channel_id: this.state.channel._id });
    }
  }

  offSocket({ channel_id }) {
    if (!FULL_SOCKET && this.props.io && this.props.io.socket) {
      this.props.io.socket.off("deletedChannelChat");
      this.props.io.socket.off("channelChat");
      this.props.io.socket.emit(
        "leaveChannel",
        channel_id ? { channel: channel_id } : {}
      );
    }
  }

  initSocket({ channel_id }) {
    if (!FULL_SOCKET) {
      const { socket } = this.props.io;
      if (socket) {
        socket.on("channelChat", msg => {
          console.log("chat received:", msg);
          if (!msg) return;
          this.props.appendMessage(msg);
        });
        socket.on("deletedChannelChat", data => {
          console.log("deleted", data);
          this.props.messageDeleted(data.message);
        });
        console.log("join channel");
        socket.emit("joinChannel", { channel: channel_id }, r => {
          console.log("joined cb", r);
        });
      }
    }
  }

  _getChatHistory = ({ channel_id }, _cb = () => {}) => {
    getChannelMessagesResource({
      token: this.props.authentication.token,
      channel_id: channel_id
    }).then(r => {
      _cb(r);
    });
  };

  _initChat = channel => {
    this.setState(
      {
        channel
      },
      () => {
        this._getChatHistory(
          {
            channel_id: channel._id
          },
          r => {
            this.setState({
              channelHistory: r.result
            });
          }
        );
      }
    );
  };

  initSubscription = ({ channel_id, group_id }) => {
    this.offSocket({ channel_id });
    this.initSocket({ channel_id });
  };

  _popToTop = () => {
    pop(this.props.componentId);
  };

  _goToChannelRoomSettings = () => {
    openChannelsDrawer({ prop: "hello", initChannel: this._initChat });
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

  _subscribe = () => {
    joinGroupResource({
      token: this.props.authentication.token,
      group_id: this.state.group._id
    }).then(r => {
      console.log("subscribed", r);
      if (r.success) {
        this.setState({ is_member: true });
      }
    });
  };

  _likeChatMessage = _id => {
    console.log("chatlike", _id, this.state.channelHistory);
    this.setState({
      channelHistory: this.state.channelHistory.map(e => {
        if (e._id === _id) {
          e.liked ? e.nb_likes-- : e.nb_likes++;
          e.liked = !e.liked;
        }
        return e;
      })
    });
    this.props.likeChatMessage(_id);
  };

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
        likeChatMessage={this._likeChatMessage}
        deleteChatMessage={this._deleteChat}
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
          disabled: !idx(["subscribed"], this.state.group),
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
                    this.props.unsubscribe(idx(["id"], this.state.group));
                    // this.props.navigation.popToTop();
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

  _deleteChat = chat_id => {
    this.props.deleteChatMessage(chat_id, r => {
      if (r.success) {
        this.setState({
          channelHistory: this.state.channelHistory.filter(
            i => i["_id"] !== chat_id
          )
        });
      }
    });
  };
  submitChat = ({ message, imageUri, tags }, _cb) => {
    const username = this.props.user.result.username;

    const messageObject = {
      channel: this.state.channel._id,
      message,
      tagged_users: [],
      attachements: []
    };

    if (imageUri) {
      messageObject.attachements.push({
        url: imageUri,
        type: "image"
      });
    }

    if (tags) {
      messageObject.tagged_users = tags;
    }

    if (!imageUri && !message) return;

    if (this.state.openedMessage)
      messageObject.reply = this.state.openedMessage.id;

    this.props.io.socket.emit("channelChat", messageObject, _message => {
      if (typeof _cb === "function") {
        _cb();
      }
      if (_message && _message._id) {
        // this.props.appendMessage(_message);
        this.state.channelHistory.unshift(_message);
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
    const chatMessages = this.state.channelHistory;
    const { theme } = this.props;
    if (this.state.loading) {
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
    }
    return (
      <Wrapper appTheme={theme}>
        {this.state.group && (
          <Header
            title={this.state.group.name}
            subTitle={this.state.channel.name}
            titlePressOpenMenu={{
              actions: [
                // {
                //   title: "info",
                //   icon: "md-information-circle-outline",
                //   action: () => {
                //     console.log("info pressed");
                //   }
                // },
                {
                  title: "invite",
                  disabled: !(
                    this.state.group.is_owner ||
                    (!this.state.group.private && this.state.group.token)
                  ),
                  icon: "md-heart-empty",
                  iconColor: theme.dangerColor,
                  action: () => {
                    console.log("invite");
                    userInvite({ group: this.state.group, generateShareToken });
                  }
                }
                // {
                //   title: "search",
                //   icon: "md-search",
                //   action: () => {
                //     console.log("delete pressed");
                //   }
                // }
              ]
            }}
            // titlePress={this._goToChannelRoomSettings}
            actions={[
              {
                postition: "left",
                type: "back",
                onPress: this._popToTop
              },
              {
                postition: "right",
                renderComponent: (
                  <HeaderItem
                    appTheme={theme}
                    onPress={() => {
                      if (this.state.inPlaylists) {
                        // remove from playlist
                        this.props.delFromPlaylist({
                          playlist_id: this.props.playlists.playlists[0]._id,
                          type: "channel",
                          item: this.state.channel._id,
                          cb: r => {
                            this.setState({ inPlaylists: false });
                            console.log("deleted!", r);
                            // show toast update icon
                            this.refs.toast.show("Removed from Favorites");
                            this.props.getPlaylists();
                          }
                        });
                      } else {
                        let playlist_id;
                        if (this.props.playlists.playlists.length > 1) {
                          console.log("list playlists to choose or create one");
                        } else {
                          this.props.addToPlaylist({
                            playlist_id: this.props.playlists.playlists[0]._id,
                            type: "channel",
                            item: this.state.channel._id,
                            cb: r => {
                              console.log("saved!", r);
                              this.setState({ inPlaylists: true });
                              // show toast update icon
                              this.refs.toast.show("Added to Favorites");
                              this.props.getPlaylists();
                            }
                          });
                        }
                      }
                    }}
                  >
                    {this.state.inPlaylists ? (
                      <Ionicons
                        name="md-heart"
                        color={theme.mainColor}
                        size={24}
                      />
                    ) : (
                      <Ionicons
                        name="md-heart-empty"
                        color={theme.mainColor}
                        size={24}
                      />
                    )}
                  </HeaderItem>
                )
              }
            ]}
          />
        )}
        {chatMessages && chatMessages.length > 0 ? (
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
          subscribed={this.state.is_member}
          subscribe={this._subscribe}
          openedMessage={this.state.openedMessage}
          closeReply={this._closeReply}
          roomName={this.state.roomName}
          token={this.props.authentication.token}
        />
        <Toast ref="toast" defaultCloseDelay={500} position="top" />
      </Wrapper>
    );
  }
}

// ChannelRoom.prototype.render = _.throttle(ChannelRoom.prototype.render, 20);

export default connect(
  state => ({
    io: state.io,
    user: state.user,
    groups: state.groups,
    playlists: state.playlists,
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
    addToPlaylist,
    delFromPlaylist,
    getPlaylists,
    blockUser,
    subscribe,
    unsubscribe,
    getSiteId,
    generateShareToken,
    getUser,
    setCurrentChannel
  }
)(withTheme(ChannelRoom));

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
