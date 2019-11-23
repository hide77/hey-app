import React from "react";
import { Navigation } from "react-native-navigation";
import { tabPush } from "hey-screens/navigation";
import I18n from "hey-i18n";
import { connect } from "react-redux";
import { FETCH } from "hey-redux/mocks";
import { createStackNavigator } from "react-navigation";
import {
  subscribe,
  unsubscribe,
  getSubscriptions
} from "hey-redux/actions/subscriptions";
import { getCurrentGroup } from "hey-redux/actions/groups";
import { getPlaylists } from "hey-redux/actions/playlists";
import { getSiteId } from "hey-redux/actions/entries";
import ChatRoom from "./ChatRoom";
import ChatRoomSettings from "./ChatRoomSettings";
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
    this.state = {
      site: "",
      screenEventListener: false
    };
  }

  componentDidMount() {
    // if (!this.state.screenEventListener) {
    //   this.setState({ screenEventListener: true });
    //   _screenEventListener = Navigation.events().registerComponentDidAppearListener(
    //     ({ componentId, componentName, passProps }) => {
    //       if (componentName === "Subscriptions") {
    //         this.props.getSubscriptions({ reset: true });
    //       }
    //     }
    //   );
    // }
  }

  _gotoGroup = group_id => {
    this.props.getCurrentGroup({
      group_id,
      cb: r => {
        tabPush("Group", {
          group: r.result
        });
      }
    });
  };

  _unsubscribe = id => {
    this.props.unsubscribe(id, () => {
      console.log("DEV/ need to update store");
    });
  };
  sd;
  _getChatRoomsHistory = () => {
    FETCH(`/v1/chats/history`, {
      token: this.props.authentication.token,
      params: {
        limit: 10
      }
    }).then(r => {
      console.log("result", r);
      if (r.success) {
        tabPush("Modal", {
          payload: r.result,
          title: "Previousely Visited",
          type: "HashtagHistory",
          parentComponent: this.props.componentId
        });
      }
    });
  };

  render() {
    const { playlists } = this.props.playlists;
    const { theme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header
          parentComponent={this.props.componentId}
          userData={this.props.user.result}
          title={I18n.t("Nav_Subscriptions")}
          actions={
            [
              // {
              //   postition: "right",
              //   type: "add",
              //   onPress: () => {
              //     tabPush("Search");
              //   }
              // },
              // {
              //   postition: "right",
              //   type: "history",
              //   onPress: this._getChatRoomsHistory
              // }
            ]
          }
        />
        {playlists.map(e => (
          <List
            style={{ zIndex: -3 }}
            appTheme={theme}
            items={e.items}
            goToGroup={this._gotoGroup}
            getPlaylists={this.props.getPlaylists}
            unsubscribe={this._unsubscribe}
            token={this.props.authentication.token}
            parentComponent={this.props.componentId}
          />
        ))}
      </Wrapper>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    subscriptions: state.subscriptions,
    playlists: state.playlists,
    authentication: state.authentication
  }),
  {
    getPlaylists,
    subscribe,
    unsubscribe,
    getSiteId,
    getSubscriptions,
    getCurrentGroup
  }
)(withTheme(Subscriptions));
