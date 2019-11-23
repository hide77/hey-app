import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { pop, tabPush } from "hey-screens/navigation";
import { connect } from "react-redux";
import * as chatActions from "hey-redux/actions/chat";
import { subscribe, unsubscribe } from "hey-redux/actions/subscriptions";
import { idx } from "hey-mocks/helper";
import thousandNumber from "hey-mocks/thousandNumber";
import Header from "hey-components/Header";
import { Wrapper } from "hey-components/Common";
import UserPicture from "hey-components/UserPicture";
import I18n from "hey-i18n";
import { withTheme } from "hey-theme";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

class ChatRoomSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialized: false, data: {} };
  }

  componentDidMount() {
    const { host } = this.props.stateParams.data;
    if (host) {
      console.log("data", this.props.stateParams.data);
      this.setState({
        initialized: true,
        roomName: `${host.is_hashtag ? "#" : ""}${host.host}`,
        data: this.props.stateParams.data
      });
    }
  }

  render() {
    const { theme } = this.props;
    return (
      this.state.initialized && (
        <Wrapper appTheme={theme}>
          <Header
            title={this.state.roomName}
            actions={[
              {
                postition: "left",
                type: "back",
                onPress: () => {
                  pop(this.props.componentId);
                }
              }
            ]}
          />
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottomWidth: 0.3,
              borderColor: theme.postBorder,
              backgroundColor: theme.postBackground
            }}
          >
            <UserPicture
              size={50}
              user={{ username: idx(["data", "host", "host"], this.state) }}
              superStyle={{ marginRight: 16 }}
            />
            <View>
              <View style={{ flexDirection: "column", paddingRight: 70 }}>
                <Text
                  style={{
                    color: theme.mainColor,
                    fontSize: 26,
                    fontWeight: "bold"
                  }}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  minimumFontScale={0.01}
                >
                  {this.state.roomName}
                </Text>
                <Text
                  style={{
                    color: theme.lightColor,
                    fontSize: 14
                  }}
                >
                  {I18n.t("Search.msgAndSubs", {
                    nb_messages: thousandNumber(
                      this.state.data.host.nb_messages
                    ),
                    nb_subscribers: thousandNumber(
                      this.state.data.host.nb_subscribers
                    )
                  })}
                </Text>
              </View>
            </View>
          </View>
          {/*DESCRIPTION*/}
          <View>
            <Text
              style={{
                textTransform: "uppercase",
                color: theme.lightColor,
                paddingHorizontal: 20,
                paddingBottom: 10,
                paddingTop: 30
              }}
            >
              Description
            </Text>
            <View
              style={{ padding: 20, backgroundColor: theme.postBackground }}
            >
              <Text style={{ color: theme.mainColor }}>
                No description provided.
              </Text>
            </View>
          </View>
          {/*OWNER*/}
          {idx(["data", "host", "is_hashtag"], this.state) && (
            <TouchableOpacity
              onPress={() => {
                if (idx(["data", "host", "owner", "username"], this.state)) {
                  tabPush("User", {
                    id: this.state.data.host.owner._id
                  });
                }
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  color: theme.lightColor,
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  paddingTop: 30
                }}
              >
                OWNER
              </Text>
              <View
                style={{
                  padding: 20,
                  backgroundColor: theme.postBackground,
                  flexDirection: "row"
                }}
              >
                <UserPicture
                  size={33}
                  user={idx(["data", "host", "owner"], this.state)}
                  superStyle={{ marginRight: 16 }}
                />
                <View>
                  <Text
                    style={{
                      color: theme.mainColor,
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                  >
                    {idx(["data", "host", "owner", "username"], this.state)}
                  </Text>
                  <Text style={{ color: theme.lightColor }}>
                    {I18n.t("Created")}{" "}
                    {dayjs(this.state.data.host.created_at).fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {/*CREATED*/}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                textAlign: "center",
                color: theme.lightColor,
                fontSize: 12
              }}
            >
              {I18n.t("Created")}{" "}
              {dayjs(this.state.data.host.created_at).fromNow()}
            </Text>
          </View>
        </Wrapper>
      )
    );
  }
}
export default connect(
  state => ({}),
  {
    getSite: chatActions.getSite,
    getUsersCount: chatActions.getUsersCount,
    appendMessage: chatActions.appendMessage,
    subscribe,
    unsubscribe
  }
)(withTheme(ChatRoomSettings));
