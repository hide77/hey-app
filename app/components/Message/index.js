import React from "react";
import { Linking, Image, Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import styled from "styled-components/native";
import ParsedText from "react-native-parsed-text";
import relativeTime from "dayjs/plugin/relativeTime";
import { Shadow, Picture } from "hey-components/Common";
import getColorFromString from "hey-mocks/getColorFromString";
import { ChatMessage } from "hey-components/Common";
import { othersContextMenu, myContextMenu } from "hey-mocks/contextMenu";
import TouchableMulti from "hey-components/TouchableMulti";
import Me from "hey-components/Message/Me";
import Other from "hey-components/Message/Other";
import { withTheme } from "hey-theme";

dayjs.extend(relativeTime);

export default withTheme(
  ({
    theme,
    message,
    myId,
    isPrivate,
    push,
    parentComponent,
    reportPost,
    reportUser,
    blockUser,
    initSubscription,
    replyToUser,
    likeChatMessage,
    deleteChatMessage,
    scrollToMessage,
    setRefresh,
    getSiteId = () => {},
    getUser = () => {}
  }) => (
    <View style={{ width: "100%", flex: 1, flexDirection: "column" }}>
      <View
        style={{
          maxWidth: "100%",
          width:
            message.attachements &&
            message.attachements.length > 0 &&
            message.attachements[0].type === "image"
              ? "100%"
              : "auto",
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignSelf: myId === message.user._id ? "flex-end" : "flex-start"
        }}
      >
        <View>
          {myId === message.user._id ? (
            <Me
              theme={theme}
              styles={styles}
              message={message}
              isPrivate={isPrivate}
              deleteChatMessage={deleteChatMessage}
              push={push}
              parentComponent={parentComponent}
              initSubscription={initSubscription}
              getSiteId={getSiteId}
              getUser={getUser}
              replyToUser={replyToUser}
              scrollToMessage={scrollToMessage}
            />
          ) : (
            <Other
              theme={theme}
              styles={styles}
              message={message}
              isPrivate={isPrivate}
              push={push}
              parentComponent={parentComponent}
              initSubscription={initSubscription}
              reportPost={reportPost}
              reportUser={reportUser}
              blockUser={blockUser}
              likeChatMessage={likeChatMessage}
              setRefresh={setRefresh}
              getSiteId={getSiteId}
              getUser={getUser}
              replyToUser={replyToUser}
              scrollToMessage={scrollToMessage}
            />
          )}
        </View>
      </View>
    </View>
  )
);

const styles = {
  chatMessage: ({ theme, me }) => ({
    backgroundColor: theme.chat(me).bubbleBg,
    borderRadius: 10,
    borderBottomRightRadius: me ? 2 : 10,
    borderBottomLeftRadius: me ? 10 : 2
  }),
  replyWrapper: {
    marginLeft: 10,
    flex: 1
  },
  reply: ({ theme, me }) => ({
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 0,
    marginRight: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.chat(me).replyBarColor,
    justifyContent: "center"
  }),
  replyTo: ({ theme, me }) => ({
    fontWeight: "bold",
    color: theme.chat(me).replyTo
  }),
  replyPreview: ({ theme, me }) => ({
    color: theme.chat(me).replyPreview
  }),
  replyImg: { minWidth: 32, minHeight: 32, marginLeft: 10 },
  author: ({ theme, me, customColor }) => ({
    color: me ? theme.chat(me).author : customColor,
    marginRight: 6
  }),
  text: ({ theme, me }) => ({
    color: theme.chat(me).text
  }),
  date: ({ theme, me }) => ({
    fontSize: 10,
    paddingBottom: 1,
    color: theme.chat(me).date
  }),
  parsed: {
    url: {
      fontWeight: "bold",
      textDecorationLine: "underline"
    },
    phone: {
      fontWeight: "bold",
      textDecorationLine: "underline"
    },
    email: {
      fontWeight: "bold",
      textDecorationLine: "underline"
    },
    mention: {
      fontWeight: "bold",
      textDecorationLine: "underline"
    },
    hashtag: {
      fontWeight: "bold",
      textDecorationLine: "underline"
    }
  }
};
