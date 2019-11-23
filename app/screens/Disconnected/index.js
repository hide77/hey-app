import React from "react";
import { Text, TouchableOpacity, View, Image, NetInfo } from "react-native";
import RNRestart from "react-native-restart";
import I18n from "hey-i18n";
import { withTheme } from "hey-theme";

class Disconnected extends React.Component {
  render() {
    const { theme } = this.props;
    return (
      <View
        style={{
          backgroundColor: theme.appBackground,
          position: "absolute",
          zIndex: 10000,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: 50
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: 18,
            marginBottom: 10,
            textAlign: "center",
            color: theme.mainColor
          }}
        >
          {I18n.t("Disconnected.title")}
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: theme.lightColor
          }}
        >
          {I18n.t("Disconnected.subtitle")}
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: theme.lightColor
          }}
        >
          {I18n.t("Disconnected.body")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            NetInfo.getConnectionInfo().then(connectionInfo => {
              console.log(
                "Initial, type: " +
                  connectionInfo.type +
                  ", effectiveType: " +
                  connectionInfo.effectiveType
              );
            });
          }}
          style={{
            borderWidth: 1,
            borderRadius: 4,
            marginTop: 20,
            borderColor: theme.focusColor,
            paddingVertical: 14,
            paddingHorizontal: 20
          }}
        >
          <Text style={{ color: theme.focusColor }}>
            {I18n.t("Disconnected.tryAgain")}
          </Text>
        </TouchableOpacity>
        <Image
          source={require("hey/img/blu.png")}
          style={{
            width: "90%",
            height: "90%",
            position: "absolute",
            bottom: "-40%"
          }}
          resizeMode="contain"
        />
      </View>
    );
  }
}

export default withTheme(Disconnected);
