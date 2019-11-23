import styled from "styled-components/native";
import { Shadow, Row } from "hey-components/Common";

export const Description = styled.Text`
  font-size: 12px;
  color: ${props => props.appTheme.lightColor};
`;

export const Card = styled(Shadow)`
  height: 61px;
  border-radius: 7px;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin: 7px 20px;
  padding: 13px 12px;
`;

export const Host = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.appTheme.mainColor};
`;

export const People = styled.Text`
  font-size: 10px;
  font-weight: normal;
  color: #ffffff;
  text-align: center;
`;

export const RoomTitle = styled(Row)`
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
`;

export const RoomInfos = styled(Row)`
  height: 14px;
  margin-top: 1px;
`;
