import React from "react";
import { Linking, Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import dayjs from "dayjs";
import thNumber from "hey-mocks/thousandNumber";
import { FETCH } from "hey-redux/mocks";
import ParsedText from "react-native-parsed-text";
import relativeTime from "dayjs/plugin/relativeTime";
import { Shadow, Picture } from "hey-components/Common";
import getColorFromString from "hey-mocks/getColorFromString";
import { ChatMessage } from "hey-components/Common";
import { othersContextMenu, myContextMenu } from "hey-mocks/contextMenu";
import TouchableMulti from "hey-components/TouchableMulti";
import { withTheme } from "hey-theme";

dayjs.extend(relativeTime);

const IconSize = 10;
const IconPadding = 4;
const IconMargin = 10;
const Icon = styled.Image`
  align-self: center;
  height: ${IconSize}px;
  width: ${IconSize}px;
`;

const ChatFooter = ({
  theme,
  message,
  other = false,
  isPrivate = false,
  likeMessage = () => {},
  pressPlus = () => {},
  navigate = () => {}
}) => {
  if ((other || message.nb_likes > 0) && !isPrivate) {
    return (
      <TouchableOpacity
        onPress={likeMessage}
        onLongPress={e => {
          if (message.nb_likes > 0) {
            FETCH(`/v1/chats/${message._id}/likes`).then(r => {
              if (r.success) {
                navigate("Modal", {
                  payload: r.result,
                  title: "Liked by",
                  type: "UserList"
                });
              }
            });
          }
        }}
        style={{
          position: "absolute",
          right: 10 - IconMargin,
          bottom: -(IconSize / 2 + IconPadding + IconMargin),
          padding: IconMargin
        }}
      >
        <View
          style={{
            backgroundColor: theme.chatRoom.reactionBg,
            borderColor: theme.chatRoom.reactionBorder,
            borderWidth: 1,
            borderRadius: IconSize,
            // shadowColor: theme.shadowColor,
            // shadowOffset: {
            //   width: 0,
            //   height: 1
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 0.3,
            // elevation: 2,
            padding: IconPadding,
            minWidth: IconSize + IconPadding * 2,
            minHeight: IconSize + IconPadding * 2
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              resizeMode="contain"
              source={
                !other || message.liked
                  ? require("hey/img/heart-red.png")
                  : require("hey/img/heart-white.png")
              }
            />
            {message.nb_likes > 0 && (
              <Text
                key={`likeBtn.${message._id}`}
                style={{
                  fontSize: 10,
                  marginLeft: 4,
                  color: other ? theme.lightColor : theme.focusColor
                }}
              >
                {thNumber(message.nb_likes)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

export default withTheme(ChatFooter);
