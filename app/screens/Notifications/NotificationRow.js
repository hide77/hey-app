import React from "react";
import { push } from "hey-screens/navigation";
import { Text, TouchableOpacity, View } from "react-native";
import UserPicture from "hey-components/UserPicture";
import I18n from "hey-i18n";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { idx } from "hey-mocks/helper";

class NotificationRow extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  _notificationClick = () => {
    const type = idx(["_data", "item", "type"], this.props);
    const host = idx(["_data", "item", "host"], this.props);
    const chatroom = idx(["_data", "item", "site", "_id"], this.props);
    const user = idx(["_data", "item", "user_from", "id"], this.props);
    const group = idx(["_data", "item", "group"], this.props);
    const channel = idx(["_data", "item", "channel"], this.props);
    if (user && type) {
      switch (type) {
        case "user.profile":
        case "user.follow":
          this._userClick(user);
          break;
        case "channelChat.like":
        case "channelChat.reply":
        case "channelChat.tagged":
          push("NotificationsScreen", "ChannelRoom", {
            channel,
            group: { ...group, is_member: true }
          });
        default:
          if (chatroom && host) {
            push("NotificationsScreen", "ChatRoom", {
              id: chatroom,
              host
            });
          }
          break;
      }
    }
  };

  _userClick = () => {
    push("NotificationsScreen", "User", {
      id: idx(["item", "user_from", "id"], this.props._data)
    });
  };

  render() {
    return (
      <View
        key={this.props._data.item._id}
        style={styles.wrapper(this.props.appTheme)}
      >
        <TouchableOpacity style={styles.center} onPress={this._userClick}>
          <UserPicture
            size={33}
            superStyle={{
              marginRight: 9,
              marginLeft: 9
            }}
            user={this.props._data.item.user_from}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.center, { flex: 1 }]}
          onPress={this._notificationClick}
        >
          <View
            style={{
              flexDirection: "row",
              margin: 4,
              marginTop: 2,
              flex: 1
            }}
          >
            <Text style={styles.notificationText(this.props.appTheme)}>
              {I18n.t(`Notifications.${this.props._data.item.type}`, {
                username: `${idx(
                  ["user_from", "username"],
                  this.props._data.item,
                  I18n.t("DeletedAccount")
                )}`
              })}
            </Text>
          </View>
          <View>
            <Text style={styles.notificationInfo(this.props.appTheme)}>
              {dayjs(this.props._data.item.created_at).fromNow()}
              {this.props._data.item.url && (
                <Text>
                  {" on "}
                  <Text style={styles.roomLink(this.props.appTheme)}>
                    {`${this.props._data.item.is_hashtag ? "#" : ""}${
                      this.props._data.item.url
                    }`}
                  </Text>
                </Text>
              )}
              {idx(["item", "group", "name"], this.props._data) && (
                <Text>
                  {" on "}
                  <Text style={styles.roomLink(this.props.appTheme)}>
                    {`${this.props._data.item.group.name}`}
                  </Text>
                </Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
export default NotificationRow;

const styles = {
  wrapper: theme => ({
    backgroundColor: theme.postBackground,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    flex: 1
  }),
  center: {
    alignItems: "flex-start",
    justifyContent: "center"
  },
  notificationText: theme => ({
    color: theme.mainColor,
    flexWrap: "wrap",
    overflow: "hidden"
  }),
  notificationInfo: theme => ({
    color: theme.lightColor,
    flexWrap: "wrap",
    overflow: "hidden"
  }),
  roomLink: theme => ({
    color: theme.focusColor,
    flexWrap: "wrap",
    overflow: "hidden"
  })
};
