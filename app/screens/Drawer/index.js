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
        <View style={{ padding: 20 }}>
          <TouchableWithoutFeedback onPress={() => pushFromDrawer("Profile")}>
            <View>
              <UserPicture
                size={80}
                user={USER}
                superStyle={{ marginBottom: 20 }}
              />
              <Text
                style={{
                  color: theme.mainColor,
                  fontWeight: "bold",
                  fontSize: 22
                }}
              >
                {idx(["username"], USER)}
              </Text>
              <Text
                style={{
                  color: theme.lightColor,
                  fontSize: 16,
                  marginBottom: 16
                }}
              >
                @{idx(["username"], USER)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.lightColor,
                  marginRight: 10
                }}
              >
                <Text style={{ fontWeight: "bold", color: theme.mainColor }}>
                  {thousandNumber(idx(["nb_followings"], USER))}
                </Text>{" "}
                Following
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, color: theme.lightColor }}>
                <Text style={{ fontWeight: "bold", color: theme.mainColor }}>
                  {thousandNumber(idx(["nb_followers"], USER))}
                </Text>{" "}
                Followers
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 20,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.postBorder
          }}
        >
          <Image
            resizeMode="contain"
            source={require("hey/img/coin.png")}
            style={{
              width: 36,
              height: 36,
              marginRight: 10
            }}
          />
          <Text
            style={{
              marginTop: 2,
              color: theme.mainColor,
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            {idx(["karma"], USER, "0")}
          </Text>
        </View>
        <ScrollView>
          {(!idx(["pictures", "default"], USER)) && (<MenuItem
            appTheme={theme}
            icon="md-alert"
            text="Add Profile Picture"
            iconColor={theme.dangerColor}
            action={() => {
              pushFromDrawer("EditProfile");
            }}
          />)}
          <MenuItem
            appTheme={theme}
            icon="md-contact"
            text="Profile"
            action={() => {
              pushFromDrawer("Profile");
            }}
          />
          <MenuItem
            appTheme={theme}
            icon="md-moon"
            text={theme.name === "dark" ? "Light Theme" : "Dark Theme"}
            iconColor={theme.lightColor}
            action={onChangeTheme}
          />
          <MenuItem
            appTheme={theme}
            icon="ios-bug"
            text="Report a bug"
            iconColor={theme.dangerColor}
            action={() => {
              this.setState(state => ({
                isDialogVisible: !state.isDialogVisible
              }));
            }}
          />
        </ScrollView>
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
