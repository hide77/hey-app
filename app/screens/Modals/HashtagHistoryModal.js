import React from "react";
import { FlatList } from "react-native";
import { Wrapper } from "hey-components/Common";
import ModalHeader from "./_Header";
import RoomRow from "./_RoomRow";

export default ({ title, payload, appTheme: theme, close }) => {
  return (
    <Wrapper appTheme={theme}>
      <ModalHeader title={title} close={close} appTheme={theme} />
      <FlatList
        data={payload}
        keyExtractor={(item, index) => item._id}
        renderItem={data => {
          return <RoomRow item={data.item} appTheme={theme} />;
        }}
      />
    </Wrapper>
  );
};
