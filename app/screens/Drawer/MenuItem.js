import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default ({
  appTheme: theme,
  icon = "ios-add",
  text,
  iconColor,
  action = () => {}
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={{
        padding: 20,
        borderBottomColor: theme.postBorder,
        borderBottomWidth: 0,
        backgroundColor: theme.postBackground,
        flexDirection: "row",
        minHeight: 48,
        alignItems: "center"
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Ionicons
          name={icon}
          style={{
            fontSize: 20,
            color: iconColor || theme.lightColor,
            fontWeight: "bold"
          }}
        />
        <View>
          <Text
            style={{
              color: theme.mainColor,
              fontSize: 16,
              marginLeft: 12,
              paddingBottom: 3
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
