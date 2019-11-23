import React from "react";
import { tabPush } from "hey-screens/navigation";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import getColorFromString from "hey-mocks/getColorFromString";
import UserPicture from "hey-components/UserPicture";
import { Picture } from "./Common";

export default ({ user, appTheme: theme, conversation }) => (
  <TouchableOpacity
    onPress={() => {
      if (conversation) {
        tabPush("PrivateChat", {
          id: user._id,
          private: true,
          user: user.username
        });
      } else {
        tabPush("User", { id: user._id });
      }
    }}
    style={{
      padding: 10,
      borderBottomColor: theme.headerBorder,
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
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <UserPicture user={user} size={33} superStyle={{ marginRight: 9 }} />
        <View>
          <Text style={{ color: theme.mainColor, fontWeight: "bold" }}>
            {user.username}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: theme.lightColor }}>
              {user.nb_followers} followers
            </Text>
          </View>
        </View>
      </View>
      <Ionicons
        name="ios-arrow-forward"
        style={{ fontSize: 18, color: theme.lightColor, fontWeight: "bold" }}
      />
    </View>
  </TouchableOpacity>
);
