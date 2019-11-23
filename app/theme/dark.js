const __ = {
  focusColor: "#568af2",
  lightColor: "#788a9c",
  mainColor: "#FFF"
};

export const darkTheme = {
  name:"dark",
  barStyle: "light-content",
  inputBorder: "#131d27",
  postBorder: "#0a121b",
  headerBorder: "#131d27",
  headerBackground: "#17212b",
  appBackground: "#0e1621",
  postBackground: "#1b2532",
  postHover: "#182533",
  focusColor: __.focusColor,
  lightColor: __.lightColor,
  heart: "#f15e67",
  dangerColor: "#f15e67",
  mainColor: __.mainColor,
  answer: "turquoise",
  follow: "gold",
  successColor: "green",
  secondaryColor: "#FFFFFF",
  shadowColor: "#000",
  chatRoom: {
    reactionBg: "#17212b",
    reactionBorder: "#0e1621",
    reactionTxt: "#6d7f8f",
    footer: {
      input: __.mainColor,
      topBorder: "#0a121b",
      backgroundColor: "#17212b",
      placeholder: "#6d7883",
      icons: "#6c7883",
      replyTo: "#FFF",
      replyPreview: "#FFF"
    }
  },
  Subscriptions: {
    unreadBg: "#3e546a",
    unreadColor: "#FFF"
  },
  chat: me =>
    me
      ? {
          bubbleBg: "#2b5278",
          replyBarColor: "#65b9f4",
          replyTo: "#65b9f4",
          replyPreview: "#FFF",
          author: "#FFF",
          text: "#FFF",
          date: "#7ca7d2"
        }
      : {
          bubbleBg: "#182533",
          replyBarColor: "#65b9f4",
          replyTo: "#65b9f4",
          replyPreview: "#FFF",
          author: "#FFF",
          text: "#f5f5f5",
          date: "#6d7f8f"
        }
};
