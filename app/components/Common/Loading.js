import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";

const Wrapper = styled.View`
  background-color: ${props=>props.appTheme.appBackground};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Loading = ({ appTheme: theme }) => {
  return (
    <Wrapper appTheme={theme}>
      <ActivityIndicator size="large" color={theme.focusColor} />
    </Wrapper>
  );
};
