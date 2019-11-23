import React from "react";
import { tabPush } from "hey-screens/navigation";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default ({ room, push, getSiteId, subscribe, appTheme: theme }) => (
  <TouchableOpacity
    onPress={() => {
      getSiteId(
        room,
        ({ id, host }) => {
          tabPush("ChatRoom", {
            id,
            host
          });
        },
        subscribe
      );
    }}
    style={{
      padding: 10,
      borderBottomColor: theme.postBorder,
      borderBottomWidth: 0.3,
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
        justifyContent: "space-between"
      }}
    >
      <Text
        style={{ fontSize: 18, color: theme.mainColor, fontWeight: "bold" }}
      >
        Create "#{room}"
      </Text>
      <Ionicons
        name="ios-arrow-forward"
        style={{ fontSize: 18, color: theme.lightColor, fontWeight: "bold" }}
      />
    </View>
  </TouchableOpacity>
);
