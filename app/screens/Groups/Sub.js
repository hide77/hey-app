import React from "react";
import { push } from "hey-screens/navigation";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import I18n from "hey-i18n";
import { Description, Host, RoomTitle } from "hey-components/Subscriptions/Sub";

dayjs.extend(relativeTime);

export default ({ channel, group, appTheme: theme, parentComponent }) => (
  <TouchableOpacity
    onPress={() => {
      push(parentComponent, "ChannelRoom", {
        channel,
        group
      });
    }}
    style={{
      flexDirection: "row",
      paddingVertical: 16
    }}
  >
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <RoomTitle>
        <Host appTheme={theme}>{`${channel.name}`}</Host>
        {channel.last_message && (
          <Description appTheme={theme}>
            {dayjs(channel.last_message.created_at).fromNow()}
          </Description>
        )}
      </RoomTitle>
      {channel.last_message && (
        <View style={{ margin: 4 }}>
          <Description
            appTheme={theme}
            style={{
              fontWeight: "bold",
              color: channel.draft ? theme.dangerColor : theme.lightColor
            }}
          >
            {channel.draft
              ? I18n.t("Draft")
              : channel.last_message.user.username}
          </Description>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Description
              appTheme={theme}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                paddingRight: 26,
                marginTop: 4,
                color: channel.draft ? theme.dangerColor : theme.lightColor
              }}
            >
              {channel.draft ? (
                channel.draft
              ) : channel.last_message && channel.last_message.message ? (
                channel.last_message.message
              ) : (
                <Text style={{ fontStyle: "italic" }}>Posted an image</Text>
              )}
            </Description>
            {channel.new_messages > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  minWidth: 20,
                  lineHeight: 20,
                  backgroundColor: theme.Subscriptions.unreadBg,
                  borderRadius: 10
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.Subscriptions.unreadColor,
                    fontSize: 10
                  }}
                >
                  {channel.new_messages}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  </TouchableOpacity>
);
