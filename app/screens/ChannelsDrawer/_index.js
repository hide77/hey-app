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
import Home from "hey-screens/Home";
import { Navigation } from "react-native-navigation";
import { pushFromDrawer } from "hey-screens/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import UserPicture from "hey-components/UserPicture";
import DialogInput from "react-native-dialog-input";
import MenuItem from "./MenuItem";
import { withTheme } from "hey-theme";
import { idx } from "hey-mocks/helper";
import thousandNumber from "hey-mocks/thousandNumber";
import highlight from "hey-mocks/highlight";
import { reportBug } from "hey-resources/Bugs/index";

class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogVisible: false
    };
  }

  render() {
    const { theme, onChangeTheme, user: { result: USER } = {} } = this.props;
    return (
      <View style={{ backgroundColor: theme.postBackground, flex: 1 }}>
        <ScrollView>
        </ScrollView>
        <View
          style={{
            backgroundColor: theme.headerBackground,
            flexDirection: "row",
            padding: 16
          }}
        >
          <TouchableOpacity
            onPress={() => pushFromDrawer("Profile")}
            style={{ flexDirection: "row" }}
          >
            <UserPicture
              size={36}
              user={USER}
              superStyle={{ marginRight: 10 }}
            />
            <View>
              <Text
                style={{
                  color: theme.mainColor,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 6
                }}
              >
                @{idx(["username"], USER)}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Image
                  resizeMode="contain"
                  source={require("hey/img/coin.png")}
                  style={{
                    width: 16,
                    height: 16,
                    marginRight: 2
                  }}
                />
                <Text
                  style={{
                    color: theme.lightColor,
                    fontSize: 12
                  }}
                >
                  {idx(["karma"], USER, "0")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              marginRight: "30%",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => pushFromDrawer("Notifications")}
            >
              <Ionicons name="md-heart" color={theme.lightColor} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons
                name="ios-settings"
                color={theme.lightColor}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onChangeTheme}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="md-moon" color={theme.lightColor} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState(state => ({
                  isDialogVisible: !state.isDialogVisible
                }));
              }}
            >
              <Ionicons name="ios-bug" color={theme.dangerColor} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          textInputProps={{ autoCorrect: false }}
          title={"😅 Oops!"}
          initValueTextInput={this.state.email}
          message={"Ok, tell us everything!"}
          hintInput={"Tell us as much as you can!"}
          submitInput={inputText => {
            reportBug({
              message: inputText,
              user: USER,
              token: this.props.authentication.token
            });
            this.setState({ isDialogVisible: false });
            setTimeout(() => {
              Alert.alert(
                "Thank you ❤️",
                "We received your message, thank you so much for taking the time, we'll work on it ASAP!",
                [
                  {
                    text: "Ok 👍"
                  }
                ],
                { cancelable: false }
              );
            }, 500);
          }}
          closeDialog={() => {
            this.setState({ isDialogVisible: false });
          }}
        />
      </View>
    );
  }
}

export default connect(state => state)(withTheme(DrawerContainer));
