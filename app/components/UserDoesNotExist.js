import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styled from "styled-components/native";
import { Shadow, Input } from "hey-components/Common";

const Instructions = styled.Text`
  font-weight: bold;
  text-align: center;
  color: ${props => props.appTheme.lightColor};
`;

export default ({ inviteUser, username, appTheme: theme }) => {
  const [email, setEmail] = useState("");

  return (
    <Shadow>
      <View
        style={{
          backgroundColor: theme.postBackground,
          borderRadius: 4,
          margin: 10
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: theme.mainColor,
              fontWeight: "bold",
              fontSize: 18,
              marginTop: 20,
              marginBottom: 6
            }}
          >
            User not found
          </Text>
          <Instructions style={{ marginBottom: 20 }} appTheme={theme}>
            Enter their email below and we'll send them an invite.
          </Instructions>
          <Input
            appTheme={theme}
            placeholderTextColor={theme.chatRoom.footer.placeholder}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            style={{
              textAlign: "center",
              height: 43,
              fontSize: 14,
              minWidth: 240,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: theme.chatRoom.footer.placeholder,
              backgroundColor: theme.chatRoom.footer.backgroundColor,
              paddingLeft: 10,
              marginHorizontal: 15,
              marginVertical: 5
            }}
          />
          <TouchableOpacity onPress={() => inviteUser([email])}>
            <Text
              style={{
                color: theme.focusColor,
                marginVertical: 20,
                textTransform: "uppercase"
              }}
            >
              Send Mail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Shadow>
  );
};
