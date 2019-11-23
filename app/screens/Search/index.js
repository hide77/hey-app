import React from "react";
import { ScrollView, View, Text, Dimensions } from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { pop, tabPush } from "hey-screens/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getSiteId, searchAll } from "hey-redux/actions/entries";
import { Header, HeaderItems, Input, Container } from "hey-components/Common";
import { Loading } from "hey-components/Common/Loading";
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

const ALL = "all";
const HASHTAGS = "hashtags";
const SITES = "sites";
const USERS = "users";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "", filter: ALL };
  }

  onChangeText(rawQuery) {
    const query = rawQuery.replace(REGEX_HASHTAG, "", "");
    this.setState({ query });
    if (query.length > 2) this.props.searchAll(query);
  }

  render() {
    console.log("search props", this.props);
    const { theme } = this.props;
    const { sites, hashtags, users } = this.props.entries.searchResults;
    const { width, height } = Dimensions.get("window");
    const trendingTopics = this.props.chat.trendingTopics;
    const inputHeight = 32;
    if (!trendingTopics) return <Loading appTheme={theme} />;
    return (
      <View style={{ minHeight: "100%", backgroundColor: theme.appBackground }}>
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
              placeholder={I18n.t("SearchCreate")}
              placeholderTextColor={theme.lightColor}
              onChangeText={query => this.onChangeText(query)}
              value={this.state.query}
              style={{ flex: 1 }}
              appTheme={theme}
            />
          </HeaderItems>
        </Header>

        {this.state.query.length > 2 ? (
          <ScrollView keyboardShouldPersistTaps="always">
            {!sites.some(site => site.host === this.state.query) &&
              !hashtags.some(hashtag => hashtag.host === this.state.query) &&
              !hashtags.some(hashtag => hashtag.name === this.state.query) && (
                <CreateRoom
                  appTheme={theme}
                  room={this.state.query}
                  subscribe={subscribe}
                  getSiteId={this.props.getSiteId}
                />
              )}
            {hashtags.length > 0 &&
              hashtags
                .slice(0, 3)
                .map(hashtag => (
                  <HashtagCard
                    appTheme={theme}
                    key={hashtag._id}
                    hashtag={hashtag}
                  />
                ))}
            {sites.length > 0 &&
              sites
                .slice(0, 3)
                .map(site => (
                  <SiteCard appTheme={theme} key={site._id} site={site} />
                ))}
            {users.length > 0 && (
              <View
                style={{
                  paddingLeft: 15,
                  paddingVertical: 6,
                  backgroundColor: theme.headerBackground,
                  borderBottomColor: theme.headerBorder,
                  borderBottomWidth: 0.3,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.lightColor,
                    fontWeight: "bold"
                  }}
                >
                  Users
                </Text>
              </View>
            )}
            {users.length > 0 &&
              users.map(user => (
                <UserCard appTheme={theme} key={user._id} user={user} />
              ))}
            <View style={{ marginBottom: 100 }} />
          </ScrollView>
        ) : (
          trendingTopics &&
          trendingTopics.length > 0 && (
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    backgroundColor: theme.postBackground,
                    borderBottomWidth: 0.3,
                    borderColor: theme.postBorder
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "left",
                      color: theme.lightColor
                    }}
                  >
                    {I18n.t("Trends.Today")}
                  </Text>
                </View>
                {trendingTopics
                  // .slice(0, 3)
                  .map(
                    ({
                      id,
                      host,
                      last_message,
                      subscribed,
                      nb_messages,
                      nb_subscribers
                    }) => (
                      <TrendCardLight
                        appTheme={theme}
                        onPress={() => {
                          tabPush("ChatRoom", {
                            id,
                            host
                          });
                        }}
                        key={id}
                        title={host}
                        subtitle={
                          <View>
                            <View>
                              <Text
                                style={{
                                  paddingTop: 4,
                                  color: theme.lightColor,
                                  fontSize: 14
                                }}
                              >
                                {I18n.t("Search.msgAndSubs", {
                                  nb_messages: thousandNumber(nb_messages),
                                  nb_subscribers: thousandNumber(nb_subscribers)
                                })}
                              </Text>
                            </View>
                          </View>
                        }
                        colors={getGradientFromRoom(host + id)}
                      />
                    )
                  )}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginVertical: 20
                  }}
                />
              </View>
            </ScrollView>
          )
        )}
      </View>
    );
  }
}

export default connect(
  state => state,
  { searchAll, getSiteId }
)(withTheme(Search));
