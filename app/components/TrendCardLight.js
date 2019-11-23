import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const TextSize = 16;
export default ({ onPress, title, subtitle, colors, appTheme: theme }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.postBackground,
        borderBottomWidth: 0.3,
        borderColor: theme.postBorder
      }}
    >
      <View>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          minimumFontScale={0.01}
          style={{
            minHeight: TextSize,
            color: theme.mainColor,
            fontSize: TextSize,
            fontWeight: "bold",
            lineHeight: TextSize
          }}
        >
          #{title}
        </Text>
        <View>{subtitle}</View>
      </View>
      <Ionicons
        name="ios-arrow-forward"
        style={{ fontSize: 18, color: theme.lightColor, fontWeight: "bold" }}
      />
    </View>
  </TouchableOpacity>
);
