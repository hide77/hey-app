import React, { Component } from "react";
import {
  AppRegistry,
  RefreshControl,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
  Text,
  ScrollView
} from "react-native";
import { push, tabPush } from "hey-screens/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { createStackNavigator } from "react-navigation";
import I18n from "hey-i18n";
import getGradientFromRoom from "hey-mocks/getGradientFromRoom";
import UserPicture from "hey-components/UserPicture";
import { $headerHeight } from "hey-mocks/ui";
import { idx } from "hey-mocks/helper";
import {
  Wrapper,
  SmallPicture,
  Shadow,
  TrendTitle,
  Container
} from "hey-components/Common";
import { Loading } from "hey-components/Common/Loading";
import Header from "hey-components/Header";
import TrendCard from "hey-components/TrendCard";
import ChatRoom from "hey-screens/Subscriptions/ChatRoom";
import ChatRoomSettings from "hey-screens/Subscriptions/ChatRoomSettings";
import User from "hey-screens/Profile/User";
import Profile from "hey-screens/Profile";
import { getTrendingTopics } from "hey-redux/actions/chat";
import Search from "hey-screens/Search";
import PushNotificationHandler from "hey-services/PushNotificationHandler";
import { withTheme } from "hey-theme";

class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = { refreshing: false, search: "" };
  }

  componentDidMount() {
    this.props.getTrendingTopics();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getTrendingTopics();
    this.setState({ refreshing: false });
  };

  render() {
    const { theme } = this.props;
    const { width, height } = Dimensions.get("window");
    const trendingTopics = this.props.chat.trendingTopics;
    const inputHeight = 32;
    if (!trendingTopics) return <Loading appTheme={theme} />;

    return (
      <Wrapper appTheme={theme} style={{ minHeight: "100%" }}>
        <Header
          parentComponent={this.props.componentId}
          userData={this.props.user.result}
          title={I18n.t("Nav_Discover")}
          actions={[
            {
              postition: "right",
              type: "search",
              onPress: () => {
                tabPush("Search", {
                  parentComponent: this.props.componentId
                });
              }
            }
          ]}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Container style={{ flex: 1 }}>
            <Text
              style={{
                alignSelf: "flex-start",
                marginVertical: 16,
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: theme.mainColor
              }}
            >
              {I18n.t("Trends.Today")}
            </Text>
            {trendingTopics.length > 0 &&
              trendingTopics
                // .slice(0, 3)
                .map(({ id, host, last_message, subscribed }) => (
                  <TrendCard
                    onPress={() => {
                      tabPush("ChatRoom", {
                        id,
                        host
                      });
                    }}
                    key={id}
                    title={host}
                    subtitle={
                      <View
                        style={{
                          flexDirection: "row",
                          height: 25,
                          alignItems: "center"
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{ color: "white", fontSize: 16 }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: "white",
                              fontSize: 16
                            }}
                          >
                            {idx(["user", "username"], last_message)}:{" "}
                          </Text>
                          {last_message && last_message.message ? (
                            last_message.message
                          ) : (
                            <Text style={{ fontStyle: "italic" }}>
                              Posted an image
                            </Text>
                          )}
                        </Text>
                      </View>
                    }
                    colors={getGradientFromRoom(host + id)}
                  />
                ))}
            {Platform.OS === "ios" && trendingTopics.length > 0 && (
              <Image
                source={require("hey/img/blu.png")}
                style={{ width: "80%", height: "80%" }}
                resizeMode="contain"
              />
            )}
          </Container>
          {Platform.OS === "android" && trendingTopics.length > 0 && (
            <Image
              source={require("hey/img/bluhalf.png")}
              resizeMode="contain"
              style={{ height: height / 2, width }}
            />
          )}
          <PushNotificationHandler
            token={this.props.authentication.token}
            device_tokens={
              this.props.user &&
              this.props.user.result &&
              this.props.user.result.device_tokens
            }
          />
        </ScrollView>
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  { getTrendingTopics }
)(withTheme(Trends));
