import React from "react";
import { tabPush } from "hey-screens/navigation";
import { Text, View, TouchableOpacity } from "react-native";
import UserPicture from "hey-components/UserPicture";

export default ({ user, appTheme: theme }) => (
  <View
    key={`LB${user.id}`}
    style={{
      borderBottomWidth: 1,
      borderBottomColor: theme.postBorder,
      backgroundColor: theme.postBackground,
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      flex: 1
    }}
  >
    <TouchableOpacity
      style={{
        alignItem: "center",
        justifyContent: "center"
      }}
      onPress={() => {
        tabPush("User", {
          id: user._id
        });
      }}
    >
      <UserPicture
        size={33}
        superStyle={{
          marginRight: 9,
          marginLeft: 9
        }}
        user={user}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flex: 1,
        alignItem: "center",
        justifyContent: "center"
      }}
      onPress={() => {
        tabPush("User", {
          id: user._id
        });
      }}
    >
      <Text
        style={{
          color: theme.mainColor,
          fontSize: 16
        }}
      >
        {user.username}
      </Text>
    </TouchableOpacity>
  </View>
);
