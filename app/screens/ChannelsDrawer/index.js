import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Alert
} from "react-native";
import AppWrapper from "hey-containers/AppWrapper";
import { Navigation } from "react-native-navigation";
import { pushFromDrawer, pushFromChannelsDrawer } from "hey-screens/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createChannelResource } from "hey-resources/Channels";
import { connect } from "react-redux";
import { setCurrentChannel, getCurrentGroup } from "hey-redux/actions/groups";
import UserPicture from "hey-components/UserPicture";
import DialogInput from "react-native-dialog-input";
import MenuItem from "./MenuItem";
import { withTheme } from "hey-theme";
import { idx } from "hey-mocks/helper";
import thousandNumber from "hey-mocks/thousandNumber";
import highlight from "hey-mocks/highlight";
import { reportBug } from "hey-resources/Bugs/index";
import { CONFIG } from "hey-mocks";

class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogVisible: false
    };
  }

  _createChannel = (name, privateChannel) => {
    this.setState({ isDialogVisible: false });
    createChannelResource({
      token: this.props.authentication.token,
      group_id: this.props.groups.currentGroup._id,
      name,
      privateChannel
    }).then(r => {
      if (r.success) {
        this.props.setCurrentChannel(r.result);
        pushFromChannelsDrawer();
        this.props.getCurrentGroup(this.props.groups.currentGroup._id);
      } else if (r.error === "max_channels") {
        Alert.alert(
          "😅 Oops",
          "It seems like you've reached the limit of channels you could create.. Not much we can do now..",
          [
            {
              text: "Ok 👍"
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "😅 Oops",
          "It seems there is a problem.. Maybe try later? ...",
          [
            {
              text: "Ok..."
            }
          ],
          { cancelable: false }
        );
      }
    });
  };

  render() {
    if (idx(["groups", "currentGroup", "channels"], this.props)) {
      const { channels, name, pictures } = this.props.groups.currentGroup;
      const { theme, onChangeTheme, user: { result: USER } = {} } = this.props;
      return (
        <View style={{ backgroundColor: theme.postBackground, flex: 1 }}>
          <View style={{ padding: 20 }}>
            <View>
              <View>
                <UserPicture
                  size={80}
                  user={{ username: name, pictures }}
                  superStyle={{ marginBottom: 20 }}
                />
                <Text
                  style={{
                    color: theme.mainColor,
                    fontWeight: "bold",
                    fontSize: 22
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    color: theme.lightColor,
                    fontSize: 16,
                    marginBottom: 16
                  }}
                >
                  {idx(["groups", "currentChannel", "name"], this.props)}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView>
            {channels.map(e => {
              if (!e.private || e.is_member)
                return (
                  <MenuItem
                    selected={
                      e._id ===
                      idx(["groups", "currentChannel", "_id"], this.props)
                    }
                    is_private={e.private}
                    appTheme={theme}
                    icon="md-arrow-forward"
                    text={`${e.name}`}
                    action={() => {
                      this.props.setCurrentChannel(e);
                      pushFromChannelsDrawer();
                    }}
                  />
                );
            })}
            {this.props.groups.currentGroup.is_owner && (
              <MenuItem
                appTheme={theme}
                icon="ios-add-circle-outline"
                text="create new channel"
                action={() => {
                  this.setState({ isDialogVisible: true });
                }}
              />
            )}
          </ScrollView>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            textInputProps={{ autoCorrect: false }}
            title={"Create new channel"}
            initValueTextInput={this.state.email}
            message={"Choose a name for your channel"}
            hintInput={"Choose wisely"}
            submitInput={inputText => {
              // create channel
              this.setState({ isDialogVisible: false });
              if (CONFIG.allow_private_channels) {
                setTimeout(() => {
                  Alert.alert(
                    "Make it public?",
                    "Public: anyone can join. Private: only if invited.",
                    [
                      {
                        text: "Private",
                        onPress: () => {
                          this._createChannel(inputText, true);
                        }
                      },
                      {
                        text: "Public",
                        onPress: () => {
                          this._createChannel(inputText, false);
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }, 100);
              } else {
                this._createChannel(inputText, false);
              }
            }}
            closeDialog={() => {
              this.setState({ isDialogVisible: false });
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

export default connect(
  state => state,
  { setCurrentChannel, getCurrentGroup }
)(withTheme(DrawerContainer));
