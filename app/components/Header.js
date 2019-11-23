import React from "react";
import { openDrawer } from "hey-screens/navigation";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";
import UserPicture from "hey-components/UserPicture";
import { $headerHeight } from "hey-mocks/ui";
import Ionicons from "react-native-vector-icons/Ionicons";
import { withTheme } from "hey-theme";

export const HeaderWrapper = styled.View`
  background-color: ${props => props.appTheme.headerBackground};
  /* height: ${$headerHeight}px; */
  flex-direction: column;
  /* justify-content: space-between;
  align-items: center;
  text-align: center; */
  border-bottom-width: 1px;
  border-color: ${props => props.appTheme.headerBorder};
`;

export const Header = styled.View`
  background-color: ${props => props.appTheme.headerBackground};
  height: ${$headerHeight}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-bottom-width: 1px;
  border-color: ${props => props.appTheme.headerBorder};
`;

export const HeaderItem = styled.TouchableOpacity`
  height: ${$headerHeight}px;
  width: ${$headerHeight}px;
  justify-content: center;
  align-items: center;
  ${props => props.title && "width: auto;"}
  ${props => props.text && "width: auto; padding-horizontal: 20px;"}
`;

const HeaderTitle = styled.Text`
  flex: 1;
  width: auto;
  text-align: center;
  font-weight: bold;
  color: ${props => props.appTheme.lightColor};
  font-size: 16px;
  line-height: ${$headerHeight};
`;

const Icons = {
  add: theme => <Ionicons name="md-add" color={theme.lightColor} size={24} />,
  search: theme => (
    <Ionicons name="ios-search" color={theme.lightColor} size={24} />
  ),
  history: theme => (
    <Ionicons name="md-time" color={theme.lightColor} size={24} />
  ),
  information: theme => (
    <Ionicons
      name="md-information-circle-outline"
      color={theme.lightColor}
      size={24}
    />
  ),
  _back: theme => (
    <Ionicons name="md-arrow-back" color={theme.lightColor} size={24} />
  ),
  back: theme => (
    <Ionicons name="md-arrow-back" color={theme.lightColor} size={24} />
  ),
  settings: theme => (
    <Ionicons name="ios-settings" color={theme.lightColor} size={24} />
  ),
  message: theme => (
    <Ionicons name="ios-mail" color={theme.lightColor} size={24} />
  ),
  add_to_playlist: theme => (
    <Ionicons name="md-heart-empty" color={theme.mainColor} size={24} />
  ),
  added_to_playlist: theme => (
    <Ionicons name="md-heart" color={theme.dangerColor} size={24} />
  ),
  text: (theme, meta) => {
    return (
      <Text style={meta ? meta.style : {}}>{meta ? meta.content : ""}</Text>
    );
  }
};

const renderHeaderElement = ({ theme, index, action }) => {
  return (
    <HeaderItem
      appTheme={theme}
      key={index}
      text={action.type === "text"}
      onPress={action.onPress}
    >
      {Icons[action.type](theme, action.text)}
    </HeaderItem>
  );
};

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerMenuOpen: false
    };
  }
  render() {
    const {
      title,
      subTitle,
      theme,
      loading,
      actions,
      titlePress,
      titlePressOpenMenu,
      userData,
      renderComponent,
      parentComponent,
      navigate = () => {}
    } = this.props;
    const $windowWidth = Dimensions.get("window").width;
    let actionsLeft = actions
      ? actions.filter(_ => _.postition === "left")
      : [];
    let actionsRight = actions
      ? actions.filter(_ => _.postition === "right")
      : [];
    if (loading) {
      return (
        <Header appTheme={theme}>
          <HeaderItem
            appTheme={theme}
            title
            style={{
              flexDirection: "row",
              flex: 1
            }}
          >
            <View
              style={{
                backgroundColor: theme.lightColor,
                opacity: 0.1,
                width: 100,
                height: 20,
                marginLeft: 40
              }}
            />
          </HeaderItem>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: theme.lightColor,
                opacity: 0.1,
                borderRadius: 15,
                marginHorizontal: 10
              }}
            />
          </View>
        </Header>
      );
    } else {
      return (
        <HeaderWrapper
          appTheme={theme}
          style={{
            zIndex: 1000
          }}
        >
          <Header appTheme={theme}>
            {userData && (
              <HeaderItem
                appTheme={theme}
                style={{
                  marginHorizontal: 10,
                  position: "absolute",
                  left: 0,
                  zIndex: 1
                }}
                key="userProfile"
                onPress={() => {
                  openDrawer(parentComponent);
                }}
              >
                <UserPicture size={36} user={userData} />
              </HeaderItem>
            )}
            {// LEFT
            actionsLeft.length > 0 ? (
              actionsLeft.map((action, index) => {
                if (action.renderComponent) {
                  return <View key={index}>{action.renderComponent}</View>;
                } else {
                  return renderHeaderElement({ theme, action, index });
                }
              })
            ) : (
              <HeaderItem appTheme={theme} />
            )
            // TITLE
            }
            <HeaderItem
              appTheme={theme}
              title
              onPress={() => {
                if (titlePressOpenMenu) {
                  console.log("OPENING HEADER MENU");
                  this.setState({
                    headerMenuOpen: !this.state.headerMenuOpen
                  });
                } else if (typeof titlePress === "function") {
                  titlePress();
                }
              }}
            >
              {subTitle ? (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      color: theme.lightColor,
                      fontSize: 11
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: theme.mainColor,
                      fontWeight: "bold"
                    }}
                  >
                    {subTitle}
                  </Text>
                </View>
              ) : (
                <HeaderTitle appTheme={theme}>{title}</HeaderTitle>
              )}
            </HeaderItem>
            <View
              style={{
                flexDirection: "row"
              }}
            >
              {// RIGHT
              actionsRight.length > 0 ? (
                actionsRight.map((action, index) => {
                  if (action.renderComponent) {
                    return <View key={index}>{action.renderComponent}</View>;
                  } else {
                    return renderHeaderElement({ theme, action, index });
                  }
                })
              ) : (
                <HeaderItem />
              )}
            </View>
          </Header>
          {this.state.headerMenuOpen && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                width: $windowWidth,
                color: theme.mainColor,
                backgroundColor: theme.headerBackground,
                position: "absolute",
                top: $headerHeight
              }}
            >
              {titlePressOpenMenu &&
                titlePressOpenMenu.actions
                  .filter(e => !e.disabled)
                  .map((e, i) => {
                    return (
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 20,
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onPress={() => {
                          this.setState(
                            {
                              headerMenuOpen: false
                            },
                            () => {
                              if (typeof e.action === "function") {
                                e.action();
                              }
                            }
                          );
                        }}
                        key={i}
                      >
                        <Ionicons
                          style={{ marginTop: 6 }}
                          name={e.icon}
                          color={e.iconColor ? e.iconColor : theme.lightColor}
                          size={20}
                        />
                        <Text
                          style={{
                            color: theme.mainColor,
                            fontSize: 12,
                            marginTop: 6,
                            marginBottom: 10
                          }}
                        >
                          {e.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </View>
          )}
        </HeaderWrapper>
      );
    }
  }
}

export default withTheme(HeaderComponent);
