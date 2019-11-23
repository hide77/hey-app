import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from "react-navigation";
import Conversations from "hey-screens/Conversations";
import Notifications from "hey-screens/Notifications";
import Profile from "hey-screens/Profile";
import Subscriptions from "hey-screens/Subscriptions";
import UserPicture from "hey-components/UserPicture";
import Modal from "hey-screens/Modals";
import Trends from "hey-screens/Trends";
import thNumber from "hey-mocks/thousandNumber";
import images from "hey-mocks/images";
import getColorFromString from "hey-mocks/getColorFromString";
import { Picture } from "hey-components/Common";
import DrawerContainer from "hey-screens/Drawer";
import { connect } from "react-redux";
import { withTheme, useTheme } from "hey-theme";

class UserProfilePicture extends React.Component {
  render() {
    return <UserPicture size={42} user={this.props.result} />;
  }
}

const UserProfilePictureWrapper = connect(state => state.user)(
  UserProfilePicture
);

class PMNotificationTab extends React.Component {
  state = {
    unreadNotifications: 0
  };
  componentDidUpdate() {
    if (
      this.props.notifications.unreadCountPM !== this.state.unreadNotifications
    ) {
      this.setState({
        unreadNotifications: this.props.notifications.unreadCountPM
      });
    }
  }
  render() {
    const { theme } = this.props;
    return (
      <View>
        {this.state.unreadNotifications > 0 && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: theme.dangerColor,
              lineHeight: 20,
              zIndex: 1,
              flex: 1,
              minWidth: 20,
              height: 20,
              borderRadius: 20
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                fontWeight: "bold",
                marginHorizontal: 6,
                textAlign: "center",
                lineHeight: 20
              }}
            >
              {thNumber(this.state.unreadNotifications)}
            </Text>
          </View>
        )}
        {images[`menu-chat-${this.props.focused ? "on" : "off"}`]}
      </View>
    );
  }
}

const PMNotificationTabWrapper = connect(state => state)(
  withTheme(PMNotificationTab)
);

class NotificationTab extends React.Component {
  state = {
    unreadNotifications: 0
  };
  componentDidUpdate() {
    if (
      this.props.notifications.unreadCount !== this.state.unreadNotifications
    ) {
      this.setState({
        unreadNotifications: this.props.notifications.unreadCount
      });
    }
  }
  render() {
    const { theme } = this.props;
    return (
      <View>
        {this.state.unreadNotifications > 0 && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: theme.dangerColor,
              lineHeight: 20,
              zIndex: 1,
              flex: 1,
              minWidth: 20,
              height: 20,
              borderRadius: 20
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                fontWeight: "bold",
                marginHorizontal: 6,
                textAlign: "center",
                lineHeight: 20
              }}
            >
              {thNumber(this.state.unreadNotifications)}
            </Text>
          </View>
        )}
        {images[`menu-not-${this.props.focused ? "on" : "off"}`]}
      </View>
    );
  }
}

const NotificationTabWrapper = connect(state => state)(
  withTheme(NotificationTab)
);

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
    theme
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;
  return (
    <View
      style={{
        backgroundColor: theme.headerBackground,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: theme.headerBorder,
        height: 62
      }}
    >
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            {renderIcon({ route, focused: isRouteActive, tintColor })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = createBottomTabNavigator(
  {
    Trends,
    Subscriptions,
    Notifications,
    Conversations
  },
  {
    initialRouteName: "Trends",
    defaultNavigationOptions: ({ navigation }) => {
      let { routeName } = navigation.state;
      let navigationOptions = {
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          defaultHandler();
          if (
            (routeName === "Trends" || routeName === "Notifications") &&
            navigation.state.index > 0
          ) {
            navigation.popToTop({ immediate: true });
          }
          if (routeName === "Notifications") {
            //mark all notifications as read
          }
        },
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;

          let image;

          if (routeName === "Conversations") {
            return <PMNotificationTabWrapper focused={focused} />;
          } else if (routeName === "Trends") {
            image = `menu-feed-${focused ? "on" : "off"}`;
          } else if (routeName === "Profile") {
            return <UserProfilePictureWrapper />;
          } else if (routeName === "Notifications") {
            return <NotificationTabWrapper focused={focused} />;
          } else if (routeName === "Subscriptions") {
            image = `menu-sub-${focused ? "on" : "off"}`;
          }
          return images[image];
        }
      };
      if (routeName === "ChatRoom" && false) {
        navigationOptions.tabBarVisible = false;
      }
      return navigationOptions;
    },
    resetOnBlur: false,
    tabBarComponent: withTheme(TabBar),
    tabBarOptions: {
      showLabel: false,
      safeAreaInset: "never"
    }
  }
);
const AppStack = createDrawerNavigator(
  {
    TabNavigator,
    Profile
  },
  {
    drawerType: "slide",
    contentComponent: ({ navigation, screenProps }) => {
      return (
        <DrawerContainer
          navigation={navigation}
          onChangeTheme={screenProps.onChangeTheme}
        />
      );
    }
  }
);

// create custom transitioner without the opacity animation, ie. for iOS
function customModalAnimation(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0]
  });
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  return {
    transform: [{ translateX }, { translateY }],
    opacity
  };
}

const AppWrapperStack = createStackNavigator(
  {
    AppStack,
    Modal
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: customModalAnimation
    })
  }
);

export default createAppContainer(withTheme(AppWrapperStack));
