import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { tabPush } from "hey-screens/navigation";
import UserPicture from "hey-components/UserPicture";
import I18n from "hey-i18n";
import thousandNumber from "hey-mocks/thousandNumber";

export default ({ item, appTheme: theme }) => (
  <View
    key={`LB${item.id}`}
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
          id: item._id
        });
      }}
    >
      <UserPicture
        size={33}
        superStyle={{
          marginRight: 9,
          marginLeft: 9
        }}
        user={{ username: item.host }}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flex: 1,
        alignItem: "center",
        justifyContent: "center"
      }}
      onPress={() => {
        tabPush("ChatRoom", {
          id: item.id,
          host: item.host
        });
      }}
    >
      <View>
        <Text
          style={{
            color: theme.mainColor,
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          {item.is_hashtag ? "#" : ""}
          {item.host}
        </Text>
        <Text
          style={{
            color: theme.lightColor,
            fontSize: 14
          }}
        >
          {I18n.t("Search.msgAndSubs", {
            nb_messages: thousandNumber(item.nb_messages),
            nb_subscribers: thousandNumber(item.nb_subscribers)
          })}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);
