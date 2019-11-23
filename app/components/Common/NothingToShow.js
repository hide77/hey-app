import React from "react";
import { View, Text, Image } from "react-native";

export default ({ children, title, header, appTheme: theme }) => (
  <View style={{ backgroundColor: theme.appBackground, flex: 1 }}>
    {children}
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("hey/img/blu-circle.png")}
        style={{ height: 170, width: 160 }}
      />
      <Text
        style={{
          fontSize: 18,
          color: theme.mainColor,
          margin: 10,
          fontWeight: "bold"
        }}
      >
        {header}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: theme.lightColor,
          textAlign: "center",
          marginHorizontal: 20
        }}
      >
        {title}
      </Text>
    </View>
  </View>
);
