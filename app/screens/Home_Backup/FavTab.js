import React from "react";
import { View, Text } from "react-native";

export const FavTab = ({}) => (
  <View
    style={{
      flex: 1,
      padding: 16
    }}
  >
    <Text
      style={{
        color: global.theme.mainColor
      }}
    >
      Favorites
    </Text>
  </View>
);
