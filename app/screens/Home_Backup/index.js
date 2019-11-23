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
import { Wrapper } from "hey-components/Common";
import { push, tabPush } from "hey-screens/navigation";
import store from "hey-redux/store";
import { FavTab } from "./FavTab";
import SubsTab from "./SubsTab";
import Header from "hey-components/Header";
import DiscoverTab from "./DiscoverTab";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { connect } from "react-redux";
import { withTheme } from "hey-theme";
import {
  getGroups,
  getJoinedGroups,
  getCurrentGroup
} from "hey-redux/actions/groups";
import {
  getGroupResource,
  joinPrivateGroupResource
} from "hey-resources/Groups";
import { createChannelResource } from "hey-resources/Channels";
import I18n from "hey-i18n";

renderTabBar = props => {
  return (
    <View style={{ flexDirection: "row" }}>
      {props.navigationState.routes.map((e, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => props.jumpTo(e.key)}
        >
          <View style={{ margin: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color:
                  index === props.navigationState.index
                    ? global.theme.mainColor
                    : global.theme.lightColor
              }}
            >
              {e.title}
            </Text>
            {index === props.navigationState.index && (
              <View
                style={{
                  backgroundColor: global.theme.focusColor,
                  height: 3,
                  borderRadius: 1,
                  marginTop: 6
                }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

// const _getGroup = group_id => {
//   const token = store.getState().authentication.token;
//   this.props.getCurrentGroup({
//     group_id,
//     cb: r => {
//       if (r.result.channels.length < 1) {
//         createChannelResource({
//           token,
//           group_id,
//           name: "general",
//           description: "this is the first and main channel",
//           privateChannel: false
//         }).then(res => {
//           r.result.channels.push(res.result);
//           _redirectToGroup(r.result);
//         });
//       } else {
//         _redirectToGroup(r.result);
//       }
//     }
//   });
// };

const _redirectToGroup = (_group, ask) => {
  console.log("group data", _group);
  push("Root", "Group", {
    group: _group
  });
};

const SubscriptionsRoute = props => <SubsTab {...props} />;

const FavoritesRoute = props => <FavTab {...props} />;

const DiscoverRoute = props => <DiscoverTab {...props} />;

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "subs", title: "My Communities" },
        // { key: "favorites", title: "Favorites" },
        { key: "discover", title: "Discover" }
      ]
    };
  }

  shouldComponentUpdate(a, b, c, d) {
    return b.index !== this.state.index;
  }

  componentDidMount() {
    this.props.getGroups();
    this.props.getJoinedGroups();
  }

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
        _redirectToGroup(r.result);
      }
    });
  };

  __getGroup = group_id => {
    const token = this.props.authentication.token;
    this.props.getCurrentGroup({
      group_id,
      cb: r => {
        if (r.result.channels.length < 1) {
          createChannelResource({
            token,
            group_id,
            name: "general",
            description: "this is the first and main channel",
            privateChannel: false
          }).then(res => {
            r.result.channels.push(res.result);
            _redirectToGroup(r.result);
          });
        } else {
          _redirectToGroup(r.result);
        }
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
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            subs: props => (
              <SubscriptionsRoute
                _getGroup={this._getGroup}
                jumpTo={props.jumpTo}
              />
            ),
            // favorites: FavoritesRoute,
            discover: () => (
              <DiscoverRoute
                _getGroup={this._getGroup}
                _askJoinPrivateGroup={this._askToJoinPrivateGroup}
              />
            )
          })}
          renderTabBar={renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
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
  { getGroups, getJoinedGroups, getCurrentGroup }
)(withTheme(HomeContainer));
