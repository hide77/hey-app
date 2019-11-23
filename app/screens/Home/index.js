import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import PushNotificationHandler from "hey-services/PushNotificationHandler";
import { Wrapper } from "hey-components/Common";
import { push, tabPush } from "hey-screens/navigation";
import store from "hey-redux/store";
import SubsTab from "./SubsTab";
import Header from "hey-components/Header";
import DiscoverTab from "./DiscoverTab";
import ScrollableTabView from "react-native-scrollable-tab-view";
import TabBar from "./TabBar";
import { connect } from "react-redux";
import { withTheme } from "hey-theme";
import { idx } from "hey-mocks/helper";
import {
  getGroups,
  getJoinedGroups,
  getCurrentGroup
} from "hey-redux/actions/groups";
import { joinGroup, joinGroupWToken } from "hey-redux/actions/groups";
import {
  getGroupResource,
  joinPrivateGroupResource
} from "hey-resources/Groups";
import { createChannelResource } from "hey-resources/Channels";
import I18n from "hey-i18n";

const SubscriptionsRoute = props => <SubsTab {...props} />;

const DiscoverRoute = props => <DiscoverTab {...props} />;

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (idx(["stateParams", "_openGroup", "id"], this.props)) {
      this._joinAndOpenGroup(idx(["stateParams", "_openGroup"], this.props));
    }
  }

  _joinAndOpenGroup = _openGroup => {
    const _cb = r => {
      console.log("joined group", r);
      this._getGroup(_openGroup.id);
      global.open_group = null;
    };
    if (_openGroup.private) {
      this.props.joinGroupWToken({
        group_id: _openGroup.id,
        shareToken: _openGroup.token,
        cb: _cb
      });
    } else {
      this.props.joinGroup({
        group_id: _openGroup.id,
        cb: _cb
      });
    }
  };

  _askToJoinPrivateGroup = group_id => {
    joinPrivateGroupResource({
      group_id,
      token: this.props.authentication.token
    }).then(r => {
      console.log("askToJoinPrivateGroup", r);
    });
  };

  _getGroup = group_id => {
    this.props.getCurrentGroup({
      group_id,
      cb: r => {
        push("Root", "Group", {
          group: r.result
        });
      }
    });
  };

  _openGroup = group => {
    this.props.getCurrentGroup({
      group,
      cb: () => {
        push("Root", "Group", {
          group: group
        });
      }
    });
  };

  render() {
    const { theme, onChangeTheme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header
          parentComponent="Root"
          userData={this.props.user.result}
          title={"Home"}
          actions={[
            {
              postition: "right",
              type: "add",
              onPress: () => {
                push("Root", "CreateCommunity");
              }
            },
            {
              postition: "right",
              type: "search",
              onPress: () => {
                tabPush("SearchGroups", {
                  parentComponent: this.props.componentId
                });
              }
            }
          ]}
        />
        <ScrollableTabView
          renderTabBar={props => <TabBar {...props} />}
          tabBarActiveTextColor={theme.mainColor}
          tabBarInactiveTextColor={theme.lightColor}
          tabBarTextStyle={{ fontSize: 16, fontWeight: "bold" }}
          tabBarUnderlineStyle={{
            backgroundColor: theme.focusColor,
            height: 3,
            borderRadius: 1
          }}
        >
          <SubscriptionsRoute
            tabLabel="My Communities"
            _getGroup={this._openGroup}
          />
          <DiscoverRoute tabLabel="Discover" _getGroup={this._getGroup} />
        </ScrollableTabView>
        <PushNotificationHandler />
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});

export default connect(
  state => state,
  { getGroups, getJoinedGroups, getCurrentGroup, joinGroup, joinGroupWToken }
)(withTheme(HomeContainer));
