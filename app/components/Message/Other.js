import React from "react";
import { tabPush } from "hey-screens/navigation";
import TouchableMulti from "hey-components/TouchableMulti";
import { Linking, Image, Text, TouchableOpacity, View } from "react-native";
import ParsedText from "react-native-parsed-text";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import MediaPreview from "hey-components/Message/MediaPreview";
import UserPicture from "hey-components/UserPicture";
import Footer from "hey-components/Message/Footer";
import getColorFromString from "hey-mocks/getColorFromString";
import { othersContextMenu } from "hey-mocks/contextMenu";
import { REGEX_HASHTAG } from "hey-mocks";

dayjs.extend(relativeTime);

export default class Other extends React.Component {
  handleUrlPress = url => Linking.openURL(url);
  handlePhonePress = phone => Linking.openURL(`tel:${phone}`);
  handleEmailPress = email => Linking.openURL(`mailto:${email}`);
  handleUserPress = user => {
    console.log("pressed user", user);
    this.props.getUser(user.slice(1), tabPush);
  };
  handleRoomPress = room => {
    this.props.getSiteId(room.slice(1), ({ id, host }) => {
      // this.props.initSubscription(id, host);
      tabPush("ChatRoom", { id, host });
    });
  };

  render() {
    const me = false;
    const {
      message,
      isPrivate,
      parentComponent,
      reportPost,
      reportUser,
      blockUser,
      replyToUser,
      initSubscription,
      likeChatMessage,
      scrollToMessage,
      setRefresh,
      theme,
      styles
    } = this.props;
    const OtherMessage = (
      <View style={styles.chatMessage({ theme, me })}>
        <TouchableMulti
          onDoubleTap={e => {
            othersContextMenu({
              e,
              message,
              push:tabPush,
              reportPost,
              reportUser,
              blockUser,
              replyToUser,
              userName: message.user.username
            });
          }}
          onLongPress={e =>
            othersContextMenu({
              e,
              message,
              push:tabPush,
              reportPost,
              reportUser,
              blockUser,
              replyToUser,
              userName: message.user.username
            })
          }
        >
          {message.reply && message.reply._id && (
            <TouchableOpacity
              onPress={({ nativeEvent }) => {
                // scrollToMessage({
                //   id: message.reply._id,
                //   postitionY: nativeEvent.pageY
                // });
              }}
              style={styles.reply({ theme, me })}
            >
              {message.reply.attachements.length > 0 && (
                <Image
                  source={{
                    uri:
                      message.reply.attachements[0].image ||
                      message.reply.attachements[0].url
                  }}
                  style={{ minWidth: 32, minHeight: 32, marginLeft: 10 }}
                />
              )}
              <View style={styles.replyWrapper}>
                <Text style={styles.replyTo({ theme, me })}>
                  {message.reply.user.username}
                </Text>
                <Text
                  style={styles.replyPreview({ theme, me })}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {message.reply.message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <View>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  tabPush("User", {
                    id: message.user.id
                  });
                }}
              >
                <UserPicture
                  size={33}
                  user={message.user}
                  superStyle={{ marginRight: 9 }}
                />
              </TouchableOpacity>
              <View style={{ paddingRight: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline"
                  }}
                >
                  <Text
                    style={styles.author({
                      theme,
                      me,
                      customColor: getColorFromString(message.user.username)
                    })}
                  >
                    {message.user.username}
                  </Text>
                  <Text style={styles.date({ theme, me })}>
                    {dayjs(message.created_at).fromNow()}
                  </Text>
                </View>
                <View style={{ paddingRight: 20 }}>
                  <ParsedText
                    style={styles.text({ theme, me })}
                    parse={[
                      {
                        type: "url",
                        style: styles.parsed.url,
                        onPress: this.handleUrlPress
                      },
                      {
                        type: "phone",
                        style: styles.parsed.phone,
                        onPress: this.handlePhonePress
                      },
                      {
                        type: "email",
                        style: styles.parsed.email,
                        onPress: this.handleEmailPress
                      },
                      {
                        pattern: /(@[^\n ]+)/i,
                        style: styles.parsed.mention,
                        onPress: this.handleUserPress
                      },
                      {
                        pattern: REGEX_HASHTAG,
                        style: styles.parsed.hashtag,
                        onPress: this.handleRoomPress
                      }
                    ]}
                    childrenProps={{ allowFontScaling: false }}
                  >
                    {message.message}
                  </ParsedText>
                </View>
              </View>
            </View>
            {message.attachements &&
              message.attachements.length > 0 &&
              message.attachements[0].type === "image" && (
                <MediaPreview
                  attachment={message.attachements[0]}
                  other
                  appTheme={theme}
                />
              )}
            <Footer
              message={message}
              navigate={tabPush}
              other
              isPrivate={isPrivate}
              likeMessage={async () => {
                likeChatMessage(message._id);
                await new Promise(resolve => setTimeout(resolve, 200));
                setRefresh();
              }}
              pressPlus={e =>
                othersContextMenu(
                  e,
                  message,
                  tabPush,
                  reportPost,
                  reportUser,
                  blockUser
                )
              }
            />
          </View>
        </TouchableMulti>
      </View>
    );
    return OtherMessage;
  }
}
