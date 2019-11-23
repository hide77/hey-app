import React from "react";
import {
  Text,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  FlatList,
  View
} from "react-native";
import { pop, openDrawer, push } from "hey-screens/navigation";
import { connect } from "react-redux";
import I18n from "hey-i18n";
import { createStackNavigator } from "react-navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getColorFromString from "hey-mocks/getColorFromString";
import {
  getNotifications,
  getCountUnread
} from "hey-redux/actions/notifications";
import UserPicture from "hey-components/UserPicture";
import { isCloseToBottom, idx } from "hey-mocks/helper";
import User from "hey-screens/Profile/User";
import ChatRoom from "hey-screens/Subscriptions/ChatRoom";
import ChatRoomSettings from "hey-screens/Subscriptions/ChatRoomSettings";
import Profile from "hey-screens/Profile";
import {
  Divider,
  Picture,
  Card,
  Action,
  ActionText
} from "hey-components/Common";
import Header from "hey-components/Header";
import NothingToShow from "hey-components/Common/NothingToShow";
import Loading from "hey-components/Common/Loading";
import highlight from "hey-mocks/highlight";
import NotificationRow from "hey-screens/Notifications/NotificationRow";
import { withTheme } from "hey-theme";

dayjs.extend(relativeTime);
const { height: screenHeight } = Dimensions.get("window");

class Notifications extends React.Component {
  state = { refreshing: false, listener: null };

  componentDidMount() {
    if (this.props.notifications.notifications.length == 0) {
      this.props.getNotifications({ reset: true });
    }
    // this.focusListener = this.props.navigation.addListener(
    //   "didFocus",
    //   async () => {
    //     if (this.props.notifications.unreadCount > 0) {
    //       this.props.getNotifications({
    //         reset: true,
    //         cb: this.props.getCountUnread
    //       });
    //     }
    //   }
    // );
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newData =
      nextProps.notifications.type !== this.props.notifications.type;
    const themeChanged = this.props.theme.name !== nextProps.theme.name;
    return newData || themeChanged;
  }

  componentWillUnmount() {
    // this.focusListener.remove();
  }

  _popToTop = () => {
    pop(this.props.componentId);
  };

  _onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.props.getNotifications({
        reset: true,
        cb: () => {
          this.setState({ refreshing: false });
        }
      });
    });
  };

  render() {
    const { theme } = this.props;
    if (!this.props.notifications.notifications && !this.state.refreshing)
      return <Loading appTheme={theme} />;
    else if (
      this.props.notifications.notifications.length === 0 &&
      !this.state.refreshing
    ) {
      return (
        <NothingToShow
          appTheme={theme}
          header={I18n.t("EmptyNotifications.header")}
          title={I18n.t("EmptyNotifications.title")}
        >
          <Header title={I18n.t("Nav_Notifications")} />
        </NothingToShow>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Header
            title={I18n.t("Nav_Notifications")}
            userData={this.props.user.result}
            parentComponent={this.props.componentId}
            actions={
              [
                // {
                //   postition: "left",
                //   type: "back",
                //   onPress: this._popToTop
                // }
              ]
            }
          />
          <FlatList
            data={this.props.notifications.notifications}
            keyExtractor={(item, index) => item._id}
            style={{ backgroundColor: theme.appBackground, zIndex: -3 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={_data => {
              return (
                <NotificationRow
                  key={_data._id}
                  _data={_data}
                  appTheme={theme}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  flex: 1,
                  borderTopWidth: 1,
                  borderColor: theme.postBorder
                }}
              />
            )}
            ListFooterComponent={() => {
              return (
                this.props.notifications.hasMore && (
                  <TouchableOpacity
                    style={{ padding: 20 }}
                    onPress={this.props.getNotifications}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.lightColor,
                        padding: 10,
                        borderWidth: 2,
                        borderRadius: 6,
                        borderColor: theme.lightColor
                      }}
                    >
                      Load more
                    </Text>
                  </TouchableOpacity>
                )
              );
            }}
          />
        </View>
      );
    }
  }
}

export default connect(
  state => ({
    user: state.user,
    notifications: state.notifications
  }),
  { getNotifications, getCountUnread }
)(withTheme(Notifications));
