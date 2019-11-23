import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default ({
  appTheme: theme,
  icon = "ios-add",
  text,
  iconColor,
  action = () => {},
  selected,
  is_private,
  is_member
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={{
        padding: 20,
        borderBottomColor: theme.postBorder,
        borderBottomWidth: 0,
        color: theme.mainColor,
        backgroundColor: selected ? theme.focusColor : theme.postBackground,
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
        {is_private ? (
          <Ionicons
            name="md-lock"
            style={{
              fontSize: 20,
              color: selected ? theme.mainColor : iconColor || theme.lightColor,
              fontWeight: "bold"
            }}
          />
        ) : (
          <Ionicons
            name={icon}
            style={{
              fontSize: 20,
              color: selected ? theme.mainColor : iconColor || theme.lightColor,
              fontWeight: "bold"
            }}
          />
        )}
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
