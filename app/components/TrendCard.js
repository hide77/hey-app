import React from "react";
import { Text, View } from "react-native";
import { Gradient, Shadow } from "./Common";

const TextSize = 28;
export default ({ onPress, title, subtitle, colors }) => (
  <Shadow onPress={onPress}>
    <Gradient
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.75, y: 1.0 }}
      locations={[0, 1]}
      colors={colors}
    >
      <View style={{ padding: 20 }}>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          minimumFontScale={0.01}
          style={{
            minHeight: TextSize,
            color: "#FFFFFF",
            fontSize: TextSize,
            fontWeight: "bold",
            lineHeight: TextSize
          }}
        >
          #{title}
        </Text>
        <View>{subtitle}</View>
      </View>
    </Gradient>
  </Shadow>
);
