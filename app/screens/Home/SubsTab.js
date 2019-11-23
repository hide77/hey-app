import React from "react";
import { connect } from "react-redux";
import { withTheme } from "hey-theme";
import { push } from "hey-screens/navigation";
import {
  getGroupResource,
  getJoinedGroupsResource
} from "hey-resources/Groups";
import { getJoinedGroups } from "hey-redux/actions/groups";
import UserPicture from "hey-components/UserPicture";
import thousandNumber from "hey-mocks/thousandNumber";
import I18n from "hey-i18n";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList
} from "react-native";

class SubsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  _getJoinedGroups = cb => {
    this.props.getJoinedGroups({
      token: this.props.authentication.token,
      cb
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this._getJoinedGroups(r => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const { joinedGroups } = this.props.groups;
    const { goToPage } = this.props;
    const communityIconSize = 60;
    return (
      <View style={{ flex: 1 }}>
        {joinedGroups && joinedGroups.length > 0 ? (
          <FlatList
            style={{
              backgroundColor: theme.appBackground
            }}
            data={joinedGroups}
            extraData={joinedGroups}
            keyExtractor={(item, index) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props._getGroup(item);
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
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16
            }}
          >
            <Text
              style={{
                color: global.theme.mainColor
              }}
            >
              You didn't join any community yet, search or browse to discover
              one!
            </Text>
            {/*<TouchableOpacity
              style={{
                marginTop: 20,
                paddingVertical: 16,
                paddingHorizontal: 24,
                backgroundColor: global.theme.lightColor,
                color: global.theme.mainColor,
                justifyContent: "center"
              }}
              onPress={() => {
                goToPage(1);
              }}
            >
              <Text
                style={{
                  textAlign: "center"
                }}
              >
                Discover
              </Text>
            </TouchableOpacity>*/}
          </View>
        )}
        {/*<TouchableOpacity
          onPress={() => {
            push("Root", "CreateCommunity");
          }}
          style={{
            paddingVertical: 16,
            marginHorizontal: 16,
            flexDirection: "row",
            borderBottomWidth: 0,
            borderColor: global.theme.lightColor
          }}
        >
          <View
            style={{
              width: communityIconSize,
              height: communityIconSize,
              borderRadius: communityIconSize / 2,
              borderColor: global.theme.lightColor,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons
              name="ios-add-circle"
              style={{
                lineHeight: communityIconSize
              }}
              color={theme.lightColor}
              size={20}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 20,
              justifyContent: "center"
            }}
          >
            <Text style={{ color: global.theme.mainColor }}>
              Create a community
            </Text>
          </View>
        </TouchableOpacity>*/}
      </View>
    );
  }
}

export default connect(
  state => state,
  { getJoinedGroups }
)(withTheme(SubsTab));
