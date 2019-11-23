import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import UserPicture from "hey-components/UserPicture";
import styled from "styled-components/native";

const H1 = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.appTheme.mainColor};
`;

const H2 = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.appTheme.lightColor};
`;

const H3 = styled.Text`
  font-size: 12px;
  color: ${props => props.appTheme.lightColor};
`;

const ElementTitle = styled.View`
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  flex-direction: row;
  margin: 0 5px;
`;

export default ({
  h1,
  h1Render,
  h1Icon,
  h2,
  h3,
  preview,
  notCount,
  pictures,
  picturesPress,
  onPressFn,
  onPressParams,
  appTheme: theme
}) => (
  <TouchableOpacity
    onPress={() => onPressFn(onPressParams)}
    style={{
      flexDirection: "row",
      paddingVertical: 16
    }}
  >
    <View style={{ flex: 1, marginHorizontal: 16, flexDirection: "row" }}>
      {pictures && (
        <TouchableOpacity onPress={picturesPress} style={{ marginRight: 10 }}>
          <UserPicture size={60} user={pictures} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <ElementTitle>
          <View style={{ flexDirection: "row" }}>
            {h1Icon && (
              <Ionicons
                name={h1Icon}
                style={{
                  lineHeight: 18,
                  marginRight: 10
                }}
                color={global.theme.lightColor}
                size={18}
              />
            )}
            {h1 ? <H1 appTheme={theme}>{h1}</H1> : h1Render}
          </View>
          <H3 appTheme={theme}>{h3}</H3>
        </ElementTitle>
        <View style={{ margin: 4 }}>
          <H2 appTheme={theme}>{h2}</H2>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <H3
              appTheme={theme}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                paddingRight: 26,
                marginTop: 4,
                color: theme.lightColor
              }}
            >
              {preview}
            </H3>
            {notCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  minWidth: 20,
                  lineHeight: 20,
                  backgroundColor: theme.Subscriptions.unreadBg,
                  borderRadius: 10
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.Subscriptions.unreadColor,
                    fontSize: 10
                  }}
                >
                  {notCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
