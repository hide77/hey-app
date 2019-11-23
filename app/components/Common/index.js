import styled from "styled-components/native";
import { Button } from "react-native";
import { $headerHeight } from "hey-mocks/ui";
import LinearGradient from "react-native-linear-gradient";

export const Wrapper = styled.View`
  flex: 1;
  min-height: 100%;
  background-color: ${props => props.appTheme.appBackground};
`;

export const Header = styled.View`
  background-color: ${props => props.appTheme.headerBackground};
  height: ${$headerHeight}px;
  min-height: ${$headerHeight}px;
  /* shadow-opacity: 0.14;
  shadow-radius: 7px;
  shadow-color: ${props => props.appTheme.shadowColor};
  shadow-offset: 0px 0px;
  elevation: 5;*/
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderItems = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Action = styled.View`
  flex-direction: row;
  margin: 4px;
  margin-top: 2px;
  flex: 1;
`;

export const ActionButton = styled.View`
  height: 42px;
  justify-content: center;
  align-items: center;
  flex: 1px;
  background-color: white;
  margin-top: 26px;
  border-radius: 4px;
`;

export const ActionText = styled.Text`
  color: ${props => props.appTheme.mainColor};
  flex-wrap: wrap;
  overflow: hidden;
  ${props => props.title && `color: ${props.appTheme.mainColor};`}
  ${props => props.light && `color: ${props.appTheme.lightColor};`}
  ${props => props.focus && `color: ${props.appTheme.focusColor};`}
`;

export const BigPicture = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

export const SmallPicture = styled.Image`
  width: 21px;
  height: 21px;
  border-radius: 4px;
`;

export const TrendTitle = styled.Text`
  height: 45px;
  color: #333943;
  font-size: 39px;
  font-weight: bold;
  line-height: 45px;
`;

export const Card = styled.View`
  margin: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: transparent;
`;

export const CardHeader = styled.View`
  flex-direction: row;
`;

export const CardSubheader = styled.View`
  padding: 10px 0;
`;

export const CardTouch = styled.TouchableOpacity`
  padding: 16px;
  background-color: ${props => props.appTheme.postBackground};
  flex: 1;
  margin-bottom: 2px;
`;

export const Container = styled.View`
  justify-content: space-between;
  align-items: center;
  margin: 19px;
  ${props =>
    props.row && "margin: 0px; margin-right: 20px; flex-direction: row;"}
`;

export const Description = styled.Text`
  color: ${props => props.appTheme.lightColor};
  font-size: 12px;
  justify-content: center;
`;

export const Divider = styled.View`
  margin: 4px 0;
  width: 100%;
  height: 2px;
  background: ${props => props.appTheme.appBackground};
`;

export const EditPicture = styled.ImageBackground`
  width: ${props => props.pictureSize}px;
  height: ${props => props.pictureSize}px;
  border-radius: ${props => props.pictureSize / 2}px;
`;

export const Flex = styled.View`
  flex: 1;
`;

export const Gradient = styled(LinearGradient)`
  height: 107px;
  border-radius: 7px;
  justify-content: center;
  margin-bottom: 15px;
  elevation: 5;
`;

export const JoinButton = styled(LinearGradient)`
  height: 42px;
  border-radius: 7px;
  justify-content: center;
  elevation: 5;
`;

export const Host = styled.Text`
  color: ${props => props.appTheme.lightColor};
  font-size: 18px;
  font-weight: bold;
`;

export const Input = styled.TextInput`
  padding: 10px;
  color: ${props => props.appTheme.mainColor};
  background-color: ${props => props.appTheme.headerBackground};
  border-color: ${props => props.appTheme.postBorder};
  ${props => props.message && "padding: 20px; padding-right: 0;"}
`;

export const InputContainer = styled.View`
  flex: 1;
  margin: 0 10px;
  justify-content: center;
`;

export const MarginPicture = styled.Image`
  padding: 4px;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  align-self: center;
  margin-right: 10px;
`;

export const Picture = styled.Image`
  width: 33px;
  height: 33px;
  border-radius: 16.5px;
  margin: ${props => (props.message ? `0` : `0 9px;`)};
  ${props => props.message && "margin-right: 9px"};
`;

export const Row = styled.View`
  flex-direction: row;
  margin: 0 5px;
`;

export const Score = styled.View`
  align-items: center;
`;

export const ScoreContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

export const ScoreText = styled.Text`
  color: ${props => props.appTheme.lightColor};
  font-size: 12px;
  ${props =>
    props.big && `color: ${props.appTheme.mainColor}; font-size: 20px;`}
`;

export const Shadow = styled.TouchableOpacity`
  width: 100%;
  /* shadow-opacity: 0.14;
  shadow-radius: 7px;
  shadow-color: #1c2ba3;
  shadow-offset: 0px 0px;
  elevation: 5; */
`;

export const SpaceFive = styled.View`
  height: 5px;
`;

export const Subtitle = styled.Text`
  color: ${props => props.appTheme.lightColor};
  font-size: 12px;
  text-align: center;
  ${props =>
    props.big &&
    `color: ${props.appTheme.mainColor}; font-size: 18px; font-weight: bold;`};
  ${props => props.focus && `color: ${focusColor};`};
  ${props =>
    props.bio &&
    `color: ${props.appTheme.mainColor}; padding: 0 5%; font-size: 14px;`};
`;

export const Title = styled.Text`
  flex-wrap: wrap;
  overflow: hidden;
  color: ${props => props.appTheme.mainColor};
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
`;

export const Toolbar = styled.View`
  height: 48px;
  flex-direction: row;
  background-color: ${props => props.appTheme.headerBackground};
  align-items: center;
  shadow-color: #3226ce;
  shadow-opacity: 0.15;
  shadow-radius: 19px;
`;

export const Username = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
`;

export const PointsButton = styled.View`
  border-radius: 7px;
  padding: 10px 0;
  justify-content: center;
`;

export const InviteButton = styled(LinearGradient)`
  border-radius: 7px;
  padding: 14px 18px;
  justify-content: center;
  elevation: 5;
`;

export const MainButton = styled(LinearGradient)`
  border-radius: 7px;
  align-self: stretch;
  padding: 16px 26px;
  justify-content: center;
  elevation: 5;
`;
