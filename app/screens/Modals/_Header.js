import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
export default ({ title, appTheme: theme, close }) => (
  <View
    style={{
      borderBottomWidth: 1,
      padding: 20,
      borderColor: theme.postBorder,
      backgroundColor: theme.postBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <Text
      style={{
        color: theme.mainColor,
        fontSize: 22,
        fontWeight: "bold"
      }}
    >
      {title}
    </Text>
    <TouchableOpacity onPress={close}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 14,
          color: theme.focusColor
        }}
      >
        close
      </Text>
    </TouchableOpacity>
  </View>
);
