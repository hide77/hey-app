import React from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  FlatList,
  Alert,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { pop, tabPush } from "hey-screens/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getSiteId, searchAll } from "hey-redux/actions/entries";
import { Header, HeaderItems, Input, Container, Wrapper } from "hey-components/Common";
import { Loading } from "hey-components/Common/Loading";
import UserPicture from "hey-components/UserPicture";
import HashtagCard from "hey-components/HashtagCard";
import { subscribe } from "hey-redux/actions/subscriptions";
import CreateRoom from "hey-components/CreateRoom";
import getGradientFromRoom from "hey-mocks/getGradientFromRoom";
import SiteCard from "hey-components/SiteCard";
import UserCard from "hey-components/UserCard";
import TrendCardLight from "hey-components/TrendCardLight";
import I18n from "hey-i18n";
import thousandNumber from "hey-mocks/thousandNumber";
import { $headerHeight } from "hey-mocks/ui";
import { withTheme } from "hey-theme";
import { REGEX_HASHTAG } from "hey-mocks";
import {
  searchGroupsResource,
  joinPrivateGroupResource
} from "hey-resources/Groups";
import { getCurrentGroup } from "hey-redux/actions/groups";

const ALL = "all";
const HASHTAGS = "hashtags";
const SITES = "sites";
const USERS = "users";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: { search: "", deep: false, limit: 50, skip: 0 },
      results: []
    };
  }

  onChangeText(rawQuery) {
    this.setState({ query: { search: rawQuery } }, () => {
      if (rawQuery.length > 2) {
        searchGroupsResource({
          ...this.state.query,
          token: this.props.authentication.token
        }).then(r => {
          console.log("search result", r);
          if (r.success) {
            this.setState({ results: r.result });
          }
        });
      }
    });
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

  _askToJoinPrivateGroup = group_id => {
    joinPrivateGroupResource({
      group_id,
      token: this.props.authentication.token
    }).then(r => {
      if (r.success) {
        this.setState({
          results: this.state.results.map(group => {
            if (group._id === group_id) {
              group.is_pending = true;
            }
            return group;
          })
        });
      }
      console.log("askToJoinPrivateGroup", r);
    });
  };

  render() {
    const { theme } = this.props;
    const groups = this.state.results;
    const { width, height } = Dimensions.get("window");
    const trendingGroups = this.props.groups.groups;
    const inputHeight = 32;
    const communityIconSize = 60;
    if (!trendingGroups) return <Loading appTheme={theme} />;
    return (
      <Wrapper appTheme={theme}>
        <Header appTheme={theme}>
          <HeaderItems>
            <Ionicons
              name="md-arrow-back"
              color={theme.lightColor}
              size={24}
              style={{
                height: $headerHeight,
                width: $headerHeight,
                lineHeight: $headerHeight,
                textAlign: "center",
                fontWeight: "bold",
                flex: 0
              }}
              onPress={() => {
                pop(this.props.componentId);
              }}
            />
            <Input
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={"Search for a group"}
              placeholderTextColor={theme.lightColor}
              onChangeText={search => this.onChangeText(search)}
              value={this.state.query.search}
              style={{ flex: 1 }}
              appTheme={theme}
            />
          </HeaderItems>
        </Header>

        {this.state.query.search.length > 2 ? (
          <FlatList
            style={{
              backgroundColor: theme.appBackground
            }}
            data={this.state.results}
            extraData={this.state.results}
            keyExtractor={(item, index) => item._id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.private && !item.is_member) {
                      if (item.is_pending) {
                        Alert.alert(
                          "Request sent",
                          "You don't have acces yet. Please wait for an admin to review your request",
                          [
                            {
                              text: "Ok"
                            }
                          ],
                          { cancelable: false }
                        );
                      } else {
                        Alert.alert(
                          "Join Private Group",
                          "This is a private group. An admin will have to give you access.",
                          [
                            {
                              text: "Cancel"
                            },
                            {
                              text: "Ask to Join",
                              onPress: () => {
                                this._askToJoinPrivateGroup(item._id);
                              }
                            }
                          ],
                          { cancelable: false }
                        );
                      }
                    } else {
                      this._gotoGroup(item._id);
                    }
                  }}
                  style={{
                    paddingVertical: 16,
                    marginHorizontal: 16,
                    flexDirection: "row",
                    borderBottomWidth: 0,
                    borderColor: global.theme.lightColor
                  }}
                >
                  <UserPicture
                    size={communityIconSize}
                    user={{ pictures: item.pictures, username: item.name }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      paddingLeft: 20,
                      justifyContent: "center"
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {item.private && (
                        <View style={{ marginRight: 10 }}>
                          <Ionicons
                            name="md-lock"
                            style={{
                              lineHeight: 14
                            }}
                            color={
                              item.is_member
                                ? global.theme.lightColor
                                : global.theme.dangerColor
                            }
                            size={14}
                          />
                        </View>
                      )}
                      <Text style={{ color: global.theme.mainColor }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{ color: global.theme.lightColor }}>
                      {`${thousandNumber(item.nb_users)} ${I18n.t(
                        "ChatRoom.subscriber",
                        { count: item.nb_users }
                      )}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          trendingGroups &&
          trendingGroups.length > 0 && (
            <FlatList
              style={{
                backgroundColor: theme.appBackground
              }}
              data={this.props.groups.groups}
              extraData={this.props.groups.groups}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this._gotoGroup(item._id);
                    }}
                    style={{
                      paddingVertical: 16,
                      marginHorizontal: 16,
                      flexDirection: "row",
                      borderBottomWidth: 0,
                      borderColor: global.theme.lightColor
                    }}
                  >
                    <UserPicture
                      size={communityIconSize}
                      bubble={item.new_chats > 0 && false}
                      user={{ pictures: item.pictures, username: item.name }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        paddingLeft: 20,
                        justifyContent: "center"
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        {item.private && (
                          <View style={{ marginRight: 10 }}>
                            <Ionicons
                              name="md-lock"
                              style={{
                                lineHeight: 14
                              }}
                              color={global.theme.lightColor}
                              size={14}
                            />
                          </View>
                        )}
                        <Text style={{ color: global.theme.mainColor }}>
                          {item.new_chats > 0 && (
                            <Text style={{ color: global.theme.dangerColor }}>
                              •{" "}
                            </Text>
                          )}
                          {item.name}
                        </Text>
                      </View>
                      <Text style={{ color: global.theme.lightColor }}>
                        {`${thousandNumber(item.nb_users)} ${I18n.t(
                          "ChatRoom.subscriber",
                          { count: item.nb_users }
                        )}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )
        )}
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  { searchAll, getSiteId, getCurrentGroup }
)(withTheme(Search));
