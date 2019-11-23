import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share,
  Clipboard
} from "react-native";
import ActionSheet from "react-native-action-sheet";
import { pop, tabPush, popToRoot } from "hey-screens/navigation";
import { connect } from "react-redux";
import { subscribe, unsubscribe } from "hey-redux/actions/subscriptions";
import {
  deleteGroup,
  addChannelToGroup,
  removeChannelFromGroup,
  leaveGroup,
  updateChannel,
  generateShareToken,
  setShareToken,
  destroyShareToken
} from "hey-redux/actions/groups";
import { adminInvite, userInvite } from "hey-services/Groups";
import { idx } from "hey-mocks/helper";
import thousandNumber from "hey-mocks/thousandNumber";
import Header from "hey-components/Header";
import { Wrapper } from "hey-components/Common";
import {
  adminGroupPendingResource,
  adminInviteUserResource,
  adminRejectUserResource
} from "hey-resources/Groups";
import DialogInput from "react-native-dialog-input";
import UserPicture from "hey-components/UserPicture";
import I18n from "hey-i18n";
import { withTheme } from "hey-theme";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { CONFIG } from "hey-mocks";
import HeyActionSheet from "hey-mocks/HeyActionSheet";
import { EXTERNAL_SHARE_LINK } from "hey-mocks/types";

const inviteLink = (shareToken, privateGroup) =>
  `${EXTERNAL_SHARE_LINK}${shareToken}`;

const BlockTitle = title => (
  <Text
    style={{
      textTransform: "uppercase",
      color: global.theme.lightColor,
      paddingHorizontal: 20,
      paddingBottom: 10,
      paddingTop: 30
    }}
  >
    {title}
  </Text>
);
class ChatRoomSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: true,
      isDialogVisible: false,
      isRenameDialogVisible: false,
      isSetTokenDialogVisible: false,
      pendingRequests: [],
      currentChannelId: null,
      currentChannelName: ""
    };
  }

  componentDidMount() {
    // nothing
    this._pendingRequests();
    console.log("group", this.props.groups.currentGroup);
  }

  _pendingRequests = () => {
    adminGroupPendingResource({
      group_id: this.props.groups.currentGroup._id,
      token: this.props.authentication.token
    }).then(r => {
      console.log("pending requests:", r.result);
      if (r.success) {
        this.setState({ pendingRequests: r.result });
      }
    });
  };

  _channelActions = (channel_id, channel_name, channel_private) => {
    HeyActionSheet({
      title: `${channel_private ? "" : "#"}${channel_name}`,
      message: "What do you want to do?",
      actions: [
        {
          title: "Rename",
          action: () => {
            this.setState({
              isRenameDialogVisible: true,
              currentChannelId: channel_id,
              currentChannelName: channel_name
            });
          }
        },
        {
          title: "Delete",
          disabled: false,
          destructiveButton: true,
          action: () => {
            Alert.alert(
              "Delete channel",
              "Are you sure you want to delete this channel?",
              [
                {
                  text: "No",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    this.props.removeChannelFromGroup({
                      channel_id,
                      cb: r => {
                        console.log("DELETED channel", channel_id);
                      }
                    });
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

  _processJoinRequest = (user, join) => {
    if (join) {
      adminInviteUserResource({
        user_id: user,
        group_id: this.props.groups.currentGroup._id,
        token: this.props.authentication.token
      }).then(r => {
        console.log("processed", r);
        if (r.success) {
          this.setState({
            pendingRequests: this.state.pendingRequests.filter(
              e => e._id !== user
            )
          });
        }
      });
    } else {
      adminRejectUserResource({
        user_id: user,
        group_id: this.props.groups.currentGroup._id,
        token: this.props.authentication.token
      }).then(r => {
        console.log("processed", r);
        if (r.success) {
          this.setState({
            pendingRequests: this.state.pendingRequests.filter(
              e => e._id !== user
            )
          });
        }
      });
    }
  };

  _createChannel = (name, privateChannel) => {
    this.setState({ isDialogVisible: false });
    this.props.addChannelToGroup({
      group_id: this.props.groups.currentGroup._id,
      name,
      privateChannel,
      cb: r => {
        if (r.success) {
          pop(this.props.componentId);
        } else if (r.error === "max_channels") {
          Alert.alert(
            "😅 Oops",
            "It seems like you've reached the limit of channels you could create.. Not much we can do now..",
            [
              {
                text: "Ok 👍"
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "😅 Oops",
            "It seems there is a problem.. Maybe try later? ...",
            [
              {
                text: "Ok..."
              }
            ],
            { cancelable: false }
          );
        }
      }
    });
  };

  _adminActionSheet = () => {
    adminInvite({
      group: this.props.groups.currentGroup,
      generateShareToken: this.props.generateShareToken,
      destroyShareToken: this.props.destroyShareToken,
      hideDialog: () => {
        this.setState({ isSetTokenDialogVisible: true });
      }
    });
  };

  _userActionSheet = () => {
    userInvite({ group: this.props.groups.currentGroup });
  };

  render() {
    const { theme } = this.props;
    return (
      this.state.initialized && (
        <Wrapper appTheme={theme}>
          <Header
            title={this.props.groups.currentGroup.name}
            actions={[
              {
                postition: "left",
                type: "back",
                onPress: () => {
                  pop(this.props.componentId);
                }
              },
              {
                postition: "right",
                type: "text",
                text: {
                  content: I18n.t("Edit"),
                  style: {
                    color: theme.focusColor,
                    fontWeight: "bold",
                    fontSize: 16
                  }
                },
                onPress: () => {
                  tabPush("EditCommunity");
                }
              }
            ]}
          />
          <ScrollView>
            {/*
            ███╗   ██╗███████╗ ██████╗
            ████╗  ██║██╔════╝██╔═══██╗
            ██╔██╗ ██║█████╗  ██║   ██║
            ██║╚██╗██║██╔══╝  ██║   ██║
            ██║ ╚████║██║     ╚██████╔╝
            ╚═╝  ╚═══╝╚═╝      ╚═════╝
            */}
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                borderBottomWidth: 0.3,
                borderColor: theme.postBorder,
                backgroundColor: theme.postBackground
              }}
            >
              <UserPicture
                size={50}
                user={{
                  username: idx(["name"], this.props.groups.currentGroup),
                  pictures: idx(["pictures"], this.props.groups.currentGroup)
                }}
                superStyle={{ marginRight: 16 }}
              />
              <View>
                <View style={{ flexDirection: "column", paddingRight: 70 }}>
                  <Text
                    style={{
                      color: theme.mainColor,
                      fontSize: 26,
                      fontWeight: "bold"
                    }}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    minimumFontScale={0.01}
                  >
                    {this.props.groups.currentGroup.name}
                  </Text>
                  <Text
                    style={{
                      color: theme.lightColor,
                      fontSize: 14
                    }}
                  >
                    {I18n.t("Search.msgAndSubs", {
                      nb_messages: thousandNumber(
                        this.props.groups.currentGroup.nb_messages
                      ),
                      nb_subscribers: thousandNumber(
                        this.props.groups.currentGroup.nb_users
                      )
                    })}
                  </Text>
                </View>
              </View>
            </View>
            {/*
            ██╗███╗   ██╗██╗   ██╗██╗████████╗███████╗
            ██║████╗  ██║██║   ██║██║╚══██╔══╝██╔════╝
            ██║██╔██╗ ██║██║   ██║██║   ██║   █████╗
            ██║██║╚██╗██║╚██╗ ██╔╝██║   ██║   ██╔══╝
            ██║██║ ╚████║ ╚████╔╝ ██║   ██║   ███████╗
            ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝   ╚═╝   ╚══════╝
            */}
            {((this.props.groups.currentGroup.token &&
              !this.props.groups.currentGroup.private) ||
              this.props.groups.currentGroup.is_admin) && (
              <View>
                {BlockTitle("♥︎ Invite Members")}
                <View
                  style={{ padding: 20, backgroundColor: theme.postBackground }}
                >
                  {this.props.groups.currentGroup.is_admin ? (
                    <View>
                      {this.props.groups.currentGroup.token ? (
                        <TouchableOpacity onPress={this._adminActionSheet}>
                          <Text
                            style={{
                              textAlign: "center",
                              color: theme.focusColor,
                              fontSize: 14
                            }}
                          >
                            {inviteLink(
                              this.props.groups.currentGroup.token,
                              this.props.groups.currentGroup.private
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            // generate link
                            this.props.generateShareToken({
                              group_id: this.props.groups.currentGroup._id,
                              cb: r => {
                                console.log("generated", r);
                              }
                            });
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color: theme.focusColor,
                              fontSize: 14
                            }}
                          >
                            {`Generate Invite Link`}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity onPress={this._userActionSheet}>
                      {/*PUBLIC*/}
                      <Text
                        style={{
                          textAlign: "center",
                          color: theme.focusColor,
                          fontSize: 14
                        }}
                      >
                        {inviteLink(
                          this.props.groups.currentGroup.token,
                          this.props.groups.currentGroup.private
                        )}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            {/*
            ██████╗ ███████╗███████╗ ██████╗
            ██╔══██╗██╔════╝██╔════╝██╔════╝
            ██║  ██║█████╗  ███████╗██║
            ██║  ██║██╔══╝  ╚════██║██║
            ██████╔╝███████╗███████║╚██████╗
            ╚═════╝ ╚══════╝╚══════╝ ╚═════╝
            */}
            <View>
              {BlockTitle("Description")}
              <View
                style={{ padding: 20, backgroundColor: theme.postBackground }}
              >
                <Text style={{ color: theme.mainColor }}>
                  {idx(["description"], this.props.groups.currentGroup)
                    ? idx(["description"], this.props.groups.currentGroup)
                    : "No description provided."}
                </Text>
              </View>
            </View>
            {/*
            ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗
           ██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗
           ██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██████╔╝
           ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██╔══██╗
           ╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██║  ██║
            ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
            */}
            {idx(["owner", "_id"], this.props.groups.currentGroup) && (
              <TouchableOpacity
                onPress={() => {
                  if (
                    idx(["owner", "username"], this.props.groups.currentGroup)
                  ) {
                    tabPush("User", {
                      id: idx(["owner", "_id"], this.props.groups.currentGroup)
                    });
                  }
                }}
              >
                {BlockTitle("Owner")}
                <View
                  style={{
                    padding: 20,
                    backgroundColor: theme.postBackground,
                    flexDirection: "row"
                  }}
                >
                  <UserPicture
                    size={33}
                    user={idx(["owner"], this.props.groups.currentGroup)}
                    superStyle={{ marginRight: 16 }}
                  />
                  <View>
                    <Text
                      style={{
                        color: theme.mainColor,
                        fontWeight: "bold",
                        fontSize: 16
                      }}
                    >
                      {idx(
                        ["owner", "username"],
                        this.props.groups.currentGroup
                      )}
                    </Text>
                    <Text style={{ color: theme.lightColor }}>
                      {`@${idx(
                        ["owner", "username_lower"],
                        this.props.groups.currentGroup
                      )}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            {/*
            ██████╗██╗  ██╗ █████╗ ███╗   ██╗
           ██╔════╝██║  ██║██╔══██╗████╗  ██║
           ██║     ███████║███████║██╔██╗ ██║
           ██║     ██╔══██║██╔══██║██║╚██╗██║
           ╚██████╗██║  ██║██║  ██║██║ ╚████║
            ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
            */}
            {this.props.groups.currentGroup.is_owner && (
              <View>
                {BlockTitle("Channels")}
                {this.props.groups.currentGroup.channels.map(e => (
                  <TouchableOpacity
                    onPress={() => {
                      this._channelActions(e._id, e.name, e.private);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: theme.postBackground,
                      borderBottomWidth: 1,
                      borderColor: theme.postBorder
                    }}
                  >
                    <Text style={{ color: theme.mainColor }}>#{e.name}</Text>
                  </TouchableOpacity>
                ))}
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor: theme.postBackground,
                    borderBottomWidth: 1,
                    borderColor: theme.postBorder
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ isDialogVisible: true });
                    }}
                  >
                    <Text style={{ color: theme.mainColor }}>
                      + Create new channel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/*
            ██████╗ ███████╗ ██████╗
            ██╔══██╗██╔════╝██╔═══██╗
            ██████╔╝█████╗  ██║   ██║
            ██╔══██╗██╔══╝  ██║▄▄ ██║
            ██║  ██║███████╗╚██████╔╝
            ╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝
            */}
            {this.props.groups.currentGroup.is_owner &&
              this.state.pendingRequests.length > 0 && (
                <View>
                  {BlockTitle("Pending Requests")}
                  {this.state.pendingRequests.map(e => (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          `Join request`,
                          `${e.username} wants to join ${
                            this.props.groups.currentGroup.name
                          }. What do you want to do?`,
                          [
                            {
                              text: "Welcome! 🎉",
                              onPress: () => {
                                this._processJoinRequest(e._id, true);
                              }
                            },
                            {
                              text: "Nope 🚫",
                              style: "destructive",
                              onPress: () => {
                                this._processJoinRequest(e._id, false);
                              }
                            },
                            {
                              text: "Not now..",
                              onPress: () => {
                                console.log("later");
                              }
                            }
                          ],
                          { cancelable: false }
                        );
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: theme.postBackground,
                        borderBottomWidth: 1,
                        borderColor: theme.postBorder,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <UserPicture
                        size={30}
                        user={e}
                        superStyle={{ marginRight: 10 }}
                      />
                      <Text style={{ color: theme.mainColor }}>{e.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            {/*
            ███╗   ███╗███████╗████████╗ █████╗
            ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗
            ██╔████╔██║█████╗     ██║   ███████║
            ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║
            ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║
            ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
            */}
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: theme.lightColor,
                  fontSize: 12
                }}
              >
                {I18n.t("Created")}{" "}
                {dayjs(this.props.groups.currentGroup.created_at).fromNow()}
              </Text>
            </View>
            {/*
            ██╗  ██╗██╗██╗     ██╗
            ██║ ██╔╝██║██║     ██║
            █████╔╝ ██║██║     ██║
            ██╔═██╗ ██║██║     ██║
            ██║  ██╗██║███████╗███████╗
            ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
            */}
            {this.props.groups.currentGroup.is_owner ? (
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => {
                  Alert.alert(
                    `@ ${this.props.groups.currentGroup.name}`,
                    `Are you sure you want to put an end to ${
                      this.props.groups.currentGroup.name
                    }? This action is not reversible!`,
                    [
                      {
                        text: "No",
                        style: "cancel"
                      },
                      {
                        text: "Destroy",
                        style: "destructive",
                        onPress: () => {
                          this.props.deleteGroup({
                            group_id: this.props.groups.currentGroup._id,
                            cb: r => {
                              console.log("deleted group", r);
                              popToRoot(this.props.componentId);
                            }
                          });
                        }
                      }
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: theme.dangerColor,
                    fontSize: 14
                  }}
                >
                  {`Destroy ${this.props.groups.currentGroup.name}`}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => {
                  Alert.alert(
                    `Leave ${this.props.groups.currentGroup.name}?`,
                    `Are you sure you want to say goodbye to ${
                      this.props.groups.currentGroup.name
                    }?`,
                    [
                      {
                        text: "No",
                        style: "cancel"
                      },
                      {
                        text: "Leave",
                        style: "destructive",
                        onPress: () => {
                          this.props.leaveGroup({
                            group_id: this.props.groups.currentGroup._id,
                            cb: r => {
                              popToRoot(this.props.componentId);
                            }
                          });
                        }
                      }
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: theme.dangerColor,
                    fontSize: 14
                  }}
                >
                  {`Leave ${this.props.groups.currentGroup.name}`}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          {/*
          ███╗   ██╗███████╗██╗    ██╗     ██████╗██╗  ██╗ █████╗ ███╗   ██╗
          ████╗  ██║██╔════╝██║    ██║    ██╔════╝██║  ██║██╔══██╗████╗  ██║
          ██╔██╗ ██║█████╗  ██║ █╗ ██║    ██║     ███████║███████║██╔██╗ ██║
          ██║╚██╗██║██╔══╝  ██║███╗██║    ██║     ██╔══██║██╔══██║██║╚██╗██║
          ██║ ╚████║███████╗╚███╔███╔╝    ╚██████╗██║  ██║██║  ██║██║ ╚████║
          ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝      ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
          */}
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            textInputProps={{ autoCorrect: false }}
            title={"Create new channel"}
            initValueTextInput={""}
            message={"Choose a name for your channel"}
            hintInput={"Choose wisely"}
            submitInput={inputText => {
              // create channel
              this.setState({ isDialogVisible: false });
              if (CONFIG.allow_private_channels) {
                setTimeout(() => {
                  Alert.alert(
                    "Make it public?",
                    "Public: anyone can join. Private: only if invited.",
                    [
                      {
                        text: "Private",
                        onPress: () => {
                          this._createChannel(inputText, true);
                        }
                      },
                      {
                        text: "Public",
                        onPress: () => {
                          this._createChannel(inputText, false);
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }, 100);
              } else {
                this._createChannel(inputText, false);
              }
            }}
            closeDialog={() => {
              this.setState({ isDialogVisible: false });
            }}
          />
          {/*
          ███████╗██████╗      ██████╗██╗  ██╗ █████╗ ███╗   ██╗
          ██╔════╝╚════██╗    ██╔════╝██║  ██║██╔══██╗████╗  ██║
          █████╗   █████╔╝    ██║     ███████║███████║██╔██╗ ██║
          ██╔══╝  ██╔═══╝     ██║     ██╔══██║██╔══██║██║╚██╗██║
          ██║     ███████╗    ╚██████╗██║  ██║██║  ██║██║ ╚████║
          ╚═╝     ╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
          */}
          <DialogInput
            isDialogVisible={this.state.isRenameDialogVisible}
            textInputProps={{ autoCorrect: false }}
            title={"Rename channel"}
            initValueTextInput={this.state.currentChannelName}
            message={"Choose a name for your channel"}
            hintInput={"Choose wisely"}
            submitInput={inputText => {
              // update channel
              this.props.updateChannel({
                channel_id: this.state.currentChannelId,
                updateData: {
                  name: inputText
                },
                cb: r => {
                  this.setState({
                    isRenameDialogVisible: false,
                    currentChannelId: null,
                    currentChannelName: ""
                  });
                  console.log("updated", r);
                }
              });
            }}
            closeDialog={() => {
              this.setState({ isRenameDialogVisible: false });
            }}
          />
          {/*
          ███████╗██████╗     ████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗
          ██╔════╝╚════██╗    ╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
          █████╗   █████╔╝       ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
          ██╔══╝  ██╔═══╝        ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
          ██║     ███████╗       ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║
          ╚═╝     ╚══════╝       ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
          */}
          <DialogInput
            isDialogVisible={this.state.isSetTokenDialogVisible}
            textInputProps={{ autoCorrect: false }}
            title={"Type a custom invite link"}
            initValueTextInput={this.state.currentChannelName}
            message={
              "Use only letters and numbers. (Not advised but you can also user dashes and underscores..)"
            }
            hintInput={"Choose wisely"}
            submitInput={inputText => {
              // check text
              // update token
              if (/^[a-z0-9][a-z0-9-_.]{1,20}[a-z0-9]$/.test(inputText)) {
                this.props.setShareToken({
                  group_id: this.props.groups.currentGroup._id,
                  tokenName: inputText,
                  cb: r => {
                    console.log("renamed", r);
                    this.setState({
                      isSetTokenDialogVisible: false
                    });
                  }
                });
              } else {
                Alert.alert(
                  "😅 Oops",
                  "Use only letters and numbers. (Not advised but you can also user dashes and underscores..)",
                  [
                    {
                      text: "Got it 👍"
                    }
                  ],
                  { cancelable: false }
                );
              }
            }}
            closeDialog={() => {
              this.setState({ isSetTokenDialogVisible: false });
            }}
          />
        </Wrapper>
      )
    );
  }
}
export default connect(
  state => state,
  {
    subscribe,
    unsubscribe,
    deleteGroup,
    leaveGroup,
    updateChannel,
    addChannelToGroup,
    removeChannelFromGroup,
    generateShareToken,
    setShareToken,
    destroyShareToken
  }
)(withTheme(ChatRoomSettings));
