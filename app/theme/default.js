const __ = {
  focusColor: "#568af2",
  lightColor: "#969eac",
  mainColor: "#000000"
};

export const defaultTheme = {
  name:"default",
  barStyle: "dark-content",
  inputBorder: "#DDD",
  postBorder: "#DDD",
  headerBorder: "#DDD",
  headerBackground: "#FFFFFF",
  appBackground: "#FFFFFF",
  postBackground: "#FFFFFF",
  postHover: "#434b58",
  focusColor: __.focusColor,
  lightColor: __.lightColor,
  heart: "#DA4267",
  dangerColor: "#DA4267",
  mainColor: __.mainColor,
  answer: "turquoise",
  follow: "gold",
  successColor: "#61B265",
  secondaryColor: "#FFFFFF",
  shadowColor: "#1c2ba3",
  chatRoom: {
    reactionBg: "#FFF",
    reactionBorder: "#DDD",
    reactionTxt: "#6d7f8f",
    footer: {
      input: __.mainColor,
      backgroundColor: "#f6f7f8",
      topBorder: "#DDD",
      placeholder: "#6d7883",
      icons: "#6c7883",
      replyTo: "#000",
      replyPreview: "#6d7f8f"
    }
  },
  Subscriptions: {
    unreadBg: "#3e546a",
    unreadColor: "#FFF"
  },
  chat: me =>
    me
      ? {
          bubbleBg: "#327fdf",
          replyBarColor: "white",
          replyTo: "white",
          replyPreview: "white",
          author: "white",
          text: "white",
          date: "white"
        }
      : {
          bubbleBg: "#f0f1f5",
          replyBarColor: __.focusColor,
          replyTo: "black",
          replyPreview: "black",
          author: "black",
          text: "black",
          date: "black"
        }
};
