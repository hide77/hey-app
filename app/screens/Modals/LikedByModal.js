import React from "react";
import { FlatList } from "react-native";
import { Wrapper } from "hey-components/Common";
import ModalHeader from "./_Header";
import UserRow from "./_UserRow";

export default ({ title, payload, appTheme: theme, close }) => {
  return (
    <Wrapper appTheme={theme}>
      <ModalHeader title={title} close={close} appTheme={theme} />
      <FlatList
        data={payload}
        keyExtractor={(user, index) => user._id}
        renderItem={user => {
          return (
            <UserRow
              user={user.item}
              appTheme={theme}
            />
          );
        }}
      />
    </Wrapper>
  );
};
