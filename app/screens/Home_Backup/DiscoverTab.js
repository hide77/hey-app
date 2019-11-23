import React from "react";
import { connect } from "react-redux";
import { withTheme } from "hey-theme";
import { push } from "hey-screens/navigation";
import UserPicture from "hey-components/UserPicture";
import thousandNumber from "hey-mocks/thousandNumber";
import { getGroupResource } from "hey-resources/Groups";
import { createChannelResource } from "hey-resources/Channels";
import I18n from "hey-i18n";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";

class DiscoverTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { groups } = this.props.groups;
    const { jumpTo } = this.props;
    const communityIconSize = 60;
    return (
      <ScrollView>
        {groups && groups.length > 0 ? (
          groups.map(group => {
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log("join", group);
                  if (group.private && !group.is_member) {
                    if (group.is_pending) {
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
                              this.props._askJoinPrivateGroup(group._id);
                            }
                          }
                        ],
                        { cancelable: false }
                      );
                    }
                  } else {
                    this.props._getGroup(group._id);
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
                  user={{ pictures: group.pictures, username: group.name }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingLeft: 20,
                    justifyContent: "center"
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    {group.private && (
                      <View style={{ marginRight: 10 }}>
                        <Ionicons
                          name="md-lock"
                          style={{
                            lineHeight: 14
                          }}
                          color={
                            group.is_member
                              ? global.theme.lightColor
                              : global.theme.dangerColor
                          }
                          size={14}
                        />
                      </View>
                    )}
                    <Text style={{ color: global.theme.mainColor }}>
                      {group.name}
                    </Text>
                  </View>
                  <Text style={{ color: global.theme.lightColor }}>
                    {`${thousandNumber(group.nb_users)} ${I18n.t(
                      "ChatRoom.subscriber",
                      { count: group.nb_users }
                    )}`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
              Wow it seems like no one ever created a single community.. makes
              no sense.. Maybe you're not connected to the internet??
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default connect(state => state)(withTheme(DiscoverTab));
