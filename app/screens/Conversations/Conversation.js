import React from "react";
import { tabPush } from "hey-screens/navigation";
import { View, Text, TouchableOpacity } from "react-native";
import { Title, Row, Picture } from "hey-components/Common";
import { Host, Description } from "hey-components/Subscriptions/Sub";
import UserPicture from "hey-components/UserPicture";
import getColorFromString from "hey-mocks/getColorFromString";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default ({ message, appTheme: theme }) => {
  if (!message) return;
  const date = dayjs(message.last_message_at);

  return (
    <TouchableOpacity
      onPress={() =>
        tabPush("PrivateChat", {
          id: message.user._id,
          private: true,
          user: message.user.username
        })
      }
      style={{
        backgroundColor: theme.postBackground,
        borderBottomWidth: 0.3,
        borderBottomColor: theme.postBorder,
        paddingVertical: 16,
        paddingHorizontal: 10,
        flex: 1
      }}
    >
      <Row>
        <UserPicture
          size={33}
          user={message.user}
          superStyle={{ marginRight: 9 }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Host appTheme={theme}>{message.user.username}</Host>
            <Description appTheme={theme}>
              {dayjs(message.last_message.created_at).fromNow()}
            </Description>
          </View>
          <Description
            appTheme={theme}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              paddingRight: 26
            }}
          >
            {message.last_message.from === message.user.id ? "" : "You: "}
            {message.last_message.message}
          </Description>
          {message.newMessages > 0 && (
            <View
              style={{
                position: "absolute",
                right: 0,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                top: 20,
                height: 20,
                minWidth: 20,
                lineHeight: 20,
                backgroundColor: theme.Subscriptions.unreadBg,
                borderRadius: 10
              }}
            >
              <Text
                style={{
                  color: theme.Subscriptions.unreadColor,
                  fontSize: 10,
                  fontWeight: "bold"
                }}
              >
                {message.newMessages}
              </Text>
            </View>
          )}
        </View>
      </Row>
    </TouchableOpacity>
  );
};
