import React from "react";
import { Text, View } from "react-native";
import { CachedImage } from "react-native-cached-image";
import getColorFromString from "hey-mocks/getColorFromString";
import { idx } from "hey-mocks/helper";

export default ({ user, superStyle = {}, size = 33, bubble }) => {
  let usernameInitial = idx(["username", 0], user, "").toUpperCase();
  return idx(["pictures", "default"], user) ? (
    <View style={superStyle}>
      {bubble && (
        <View
          style={{
            width: size / 5,
            height: size / 5,
            backgroundColor: "#f15e67",
            borderRadius: size / 10,
            position: "absolute",
            zIndex: 2,
            top: size / 25,
            right: size / 25
          }}
        />
      )}
      <CachedImage
        style={{
          backgroundColor: "#C6CDDB",
          width: size,
          height: size,
          borderRadius: size / 2
        }}
        loadingIndicator={() => (
          <View
            style={{
              backgroundColor: "#C6CDDB",
              width: size,
              height: size,
              borderRadius: size / 2
            }}
          />
        )}
        source={{
          uri:
            user.pictures.default.indexOf("http") === 0
              ? `${user.pictures.default}`
              : `https://${user.pictures.default}`
        }}
      />
    </View>
  ) : (
    <View style={superStyle}>
      {bubble && (
        <View
          style={{
            width: size / 5,
            height: size / 5,
            backgroundColor: "#f15e67",
            borderRadius: size / 10,
            position: "absolute",
            zIndex: 2,
            top: size / 25,
            right: size / 25
          }}
        />
      )}
      <View
        style={{
          width: size,
          height: size,
          lineHeight: size,
          borderRadius: size / 2,
          backgroundColor: getColorFromString(usernameInitial),
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: size / 2,
            fontWeight: "bold",
            lineHeight: size,
            textAlign: "center"
          }}
        >
          {usernameInitial}
        </Text>
      </View>
    </View>
  );
};
