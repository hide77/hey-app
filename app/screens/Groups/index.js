import React from "react";
import { TouchableOpacity, Text } from "react-native";
import UserPicture from "hey-components/UserPicture";
import { Navigation } from "react-native-navigation";
import { tabPush, pop, popToRoot } from "hey-screens/navigation";
import I18n from "hey-i18n";
import { connect } from "react-redux";
import { FETCH } from "hey-redux/mocks";
import {
  subscribe,
  unsubscribe,
  getSubscriptions
} from "hey-redux/actions/subscriptions";
import { generateShareToken } from "hey-redux/actions/groups";
import { getSiteId } from "hey-redux/actions/entries";
import { userInvite } from "hey-services/Groups";
import ChannelRoom from "./ChannelRoom";
import ChannelRoomSettings from "./ChannelRoomSettings";
import User from "hey-screens/Profile/User";
import { withTheme } from "hey-theme";
import Discover from "hey-components/Subscriptions/Discover";
import { Wrapper } from "hey-components/Common";
import Header from "hey-components/Header";
import List from "./List";
import Search from "hey-screens/Search";
import { isCloseToBottom } from "hey-mocks/helper";
import Profile from "hey-screens/Profile";

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
  }

  _unsubscribe = id => {
    this.props.unsubscribe(id, () => {
      console.log("DEV/ need to update store");
    });
  };

  _goToChatRoomSettings = () => {
    tabPush("ChannelRoomSettings", {
      group: this.props.groups.currentGroup
    });
  };

  render() {
    const channels = this.props.groups.currentGroup.channels;
    console.log("channels", channels);
    const { theme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header
          parentComponent={this.props.componentId}
          title={this.props.groups.currentGroup.name}
          actions={[
            // {
            //   postition: "right",
            //   type: "add",
            //   onPress: () => {
            //     tabPush("Search");
            //   }
            // },
            {
              postition: "left",
              type: "back",
              onPress: () => {
                popToRoot(this.props.componentId);
              }
            },
            {
              postition: "right",
              renderComponent: (
                <TouchableOpacity onPress={this._goToChatRoomSettings}>
                  <UserPicture
                    size={30}
                    superStyle={{ marginHorizontal: 10 }}
                    user={{
                      username: this.props.groups.currentGroup.name,
                      pictures: this.props.groups.currentGroup.pictures
                    }}
                  />
                </TouchableOpacity>
              )
            }
            // {
            //   postition: "right",
            //   type: "history",
            //   onPress: this._getChatRoomsHistory
            // }
          ]}
          titlePressOpenMenu={{
            actions: [
              {
                title: "info",
                icon: "md-information-circle-outline",
                action: this._goToChatRoomSettings
              },
              {
                title: "invite",
                disabled: !(
                  this.props.groups.currentGroup.is_owner ||
                  (!this.props.groups.currentGroup.private &&
                    this.props.groups.currentGroup.token)
                ),
                icon: "md-heart-empty",
                iconColor: theme.dangerColor,
                action: () => {
                  console.log("invite");
                  userInvite({
                    group: this.props.groups.currentGroup,
                    generateShareToken: this.props.generateShareToken
                  });
                }
              }
              // {
              //   title: "search",
              //   icon: "md-search",
              //   action: () => {
              //     console.log("delete pressed");
              //   }
              // }
            ]
          }}
        />
        <List
          style={{ zIndex: -3 }}
          appTheme={theme}
          channels={channels}
          group={this.props.groups.currentGroup}
          unsubscribe={this._unsubscribe}
          token={this.props.authentication.token}
          parentComponent={this.props.componentId}
        />
      </Wrapper>
    );
  }
}

export default connect(
  state => ({
    groups: state.groups,
    user: state.user,
    subscriptions: state.subscriptions,
    authentication: state.authentication
  }),
  {
    subscribe,
    unsubscribe,
    getSiteId,
    getSubscriptions,
    generateShareToken
  }
)(withTheme(Subscriptions));
