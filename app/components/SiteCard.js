import React from "react";
import { tabPush } from "hey-screens/navigation";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import thousandNumber from "hey-mocks/thousandNumber";
import I18n from "hey-i18n";

export default ({ site, appTheme: theme, subscribe = () => {} }) => (
  <TouchableOpacity
    onPress={() => {
      tabPush("ChatRoom", { id: site._id, host: site.host });
      subscribe(site._id);
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
        flexDirection: "column",
        justifyContent: "flex-start"
      }}
    >
      <View>
        <Text
          style={{ fontSize: 18, color: theme.mainColor, fontWeight: "bold" }}
        >
          Join
          <Text
            style={{
              color: theme.focusColor
            }}
          >
            {` ${site.host}`}
          </Text>
        </Text>
      </View>
      {site.nb_subscribers > 0 && (
        <View>
          <Text
            style={{
              fontWeight: "normal",
              color: theme.lightColor,
              fontSize: 11
            }}
          >{`${thousandNumber(site.nb_subscribers)} ${I18n.t(
            "ChatRoom.subscriber",
            { count: site.nb_subscribers }
          )}`}</Text>
        </View>
      )}
    </View>
    <Ionicons
      name="ios-arrow-forward"
      style={{ fontSize: 18, color: theme.lightColor, fontWeight: "bold" }}
    />
  </TouchableOpacity>
);
