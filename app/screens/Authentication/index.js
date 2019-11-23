import React from "react";
import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Linking,
  ToastAndroid,
  TouchableOpacity,
  Text,
  Button,
  Platform,
  View
} from "react-native";
import { connect } from "react-redux";
import Toast, { DURATION } from "react-native-easy-toast";
import I18n from "hey-i18n";
import {
  loginUser,
  registerUser,
  resetPassword
} from "hey-redux/actions/authentication";
import {
  TrendTitle,
  SpaceFive,
  Title,
  Input,
  MainButton
} from "hey-components/Common";
import { Loading } from "hey-components/Common/Loading";
import DialogInput from "react-native-dialog-input";
import { withTheme } from "hey-theme";

class Authentication extends React.Component {
  state = {
    email: "",
    password: "",
    referral: "",
    isDialogVisible: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.authentication.errorMessage) {
      this.refs.toast.show(this.props.authentication.error);
    }
  }

  validate = values => {
    let errors = {};

    if (!values.email) errors.email = "Required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,99}$/i.test(values.email))
      errors.email = "Invalid email address";

    return errors;
  };

  login = () => {
    this.props.loginUser(this.state);
  };

  register = () => {
    this.props.registerUser(this.state);
  };

  reset = () => {
    this.props.resetPassword(this.state);
  };

  visitTOS = () => {
    Linking.canOpenURL("https://manifesto.hey.network/legal-notice").then(
      supported => {
        if (supported) {
          Linking.openURL("https://manifesto.hey.network/legal-notice");
        } else {
          console.log("Don't know how to open URI: " + this.props.url);
        }
      }
    );
  };

  render() {
    const { theme } = this.props;
    const DEFAULT_API_URL = "https://api2.get-hey.com";

    if (this.props.authentication.isLoading)
      return <Loading appTheme={theme} />;

    return this.state.register ? (
      <ScrollView
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
      >
        <KeyboardAvoidingView
          style={{ flex: 1, alignItems: "center", marginBottom: 40 }}
        >
          <Image
            source={require("hey/img/blu-circle.png")}
            style={{ width: 200, height: 200, margin: 20 }}
          />
          <View style={{ flex: 1, width: "80%" }}>
            <Input
              appTheme={theme}
              textContentType="emailAddress"
              placeholderTextColor="#c4c3cb"
              placeholder={I18n.t("Form_EmailAddress")}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                this.usernameInput.focus();
              }}
              returnKeyType={"next"}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: 43,
                fontSize: 14,
                borderRadius: 5,
                borderWidth: 1,
                paddingLeft: 10,
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <React.Fragment>
              <Input
                appTheme={theme}
                placeholderTextColor="#c4c3cb"
                placeholder={I18n.t("Form_Username")}
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  this.passwordInput.focus();
                }}
                returnKeyType={"next"}
                ref={input => {
                  this.usernameInput = input;
                }}
                style={{
                  height: 43,
                  fontSize: 14,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10,
                  marginTop: 5,
                  marginBottom: 5
                }}
              />
            </React.Fragment>
            <View style={{ flex: 1, width: "100%", position: "relative" }}>
              <Input
                appTheme={theme}
                textContentType="password"
                placeholderTextColor="#c4c3cb"
                placeholder={I18n.t("Form_Password")}
                selectionColor={theme.focusColor}
                onChangeText={password => this.setState({ password })}
                onSubmitEditing={() => {
                  this.invitationInput.focus();
                }}
                returnKeyType={"next"}
                ref={input => {
                  this.passwordInput = input;
                }}
                value={this.state.password}
                autoCapitalize="none"
                textContentType="password"
                secureTextEntry
                style={{
                  height: 43,
                  fontSize: 14,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10,
                  paddingRight: 66,
                  marginTop: 5,
                  marginBottom: 5
                }}
              />
            </View>

            <React.Fragment>
              <Input
                appTheme={theme}
                autoCapitalize="characters"
                onChangeText={referral => this.setState({ referral })}
                placeholder={I18n.t("Form_InvitationCode")}
                placeholderTextColor="#c4c3cb"
                selectionColor={theme.focusColor}
                ref={input => {
                  this.invitationInput = input;
                }}
                returnKeyType={"send"}
                onSubmitEditing={() => {
                  this.register();
                }}
                value={this.state.referral}
                style={{
                  height: 43,
                  fontSize: 14,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10,
                  marginTop: 5,
                  marginBottom: 5
                }}
              />
            </React.Fragment>
            <SpaceFive />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: theme.lightColor }}>
                {I18n.t("Auth_ByRegisteringYouAcceptOur")}
              </Text>
              <TouchableOpacity
                onPress={this.visitTOS}
                accessibilityLabel={I18n.t("Auth_ByRegisteringYouAcceptOur")}
              >
                <Text style={{ color: theme.focusColor }}>
                  {I18n.t("Auth_TermsOfService")}
                </Text>
              </TouchableOpacity>
            </View>
            <SpaceFive />
            <TouchableOpacity
              accessibilityLabel="Register to Hey"
              onPress={this.register}
              style={{ marginTop: 10 }}
            >
              <MainButton
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.75, y: 1.0 }}
                locations={[0, 1]}
                colors={["#4FCFD7", "#257CF3"]}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase"
                  }}
                >
                  {I18n.t("Auth_Register")}
                </Text>
              </MainButton>
            </TouchableOpacity>
            <SpaceFive />
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  marginBottom: 10,
                  color: theme.lightColor
                }}
              >
                {I18n.t("Auth_AlreadyHaveAnAccount")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState(state => ({ register: !state.register }))
              }
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: theme.focusColor
                }}
              >
                {I18n.t("Auth_Login")}
              </Text>
            </TouchableOpacity>
          </View>
          <Toast ref="toast" />
        </KeyboardAvoidingView>
      </ScrollView>
    ) : (
      <ScrollView
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
      >
        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          textInputProps={{ autoCorrect: false, keyboardType: "email-address" }}
          title={"It's all good, don't worry!"}
          initValueTextInput={this.state.email}
          message={"We'll send you an email to reset your password."}
          hintInput={"Email Address"}
          submitInput={inputText => {
            let errors = this.validate({ email: inputText });
            if (errors.email) {
              console.log("email error: ", errors.email);
            } else {
              this.reset({ email: inputText });
              this.setState({ isDialogVisible: false });
              setTimeout(() => {
                Alert.alert(
                  "Check your inbox!",
                  "We just sent you an email (If you don't receive it, check your spam folder 😅 That happens sometimes..)",
                  [
                    {
                      text: "Ok 👍"
                    }
                  ],
                  { cancelable: false }
                );
              }, 500);
            }
          }}
          closeDialog={() => {
            this.setState({ isDialogVisible: false });
          }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1, alignItems: "center", marginBottom: 40 }}
        >
          <Image
            source={require("hey/img/blu-circle.png")}
            style={{ width: 200, height: 200, margin: 20 }}
          />
          <View style={{ flex: 1, width: "80%" }}>
            <Input
              appTheme={theme}
              textContentType="emailAddress"
              placeholderTextColor="#c4c3cb"
              placeholder={I18n.t("Form_EmailAddress")}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: 43,
                fontSize: 14,
                borderRadius: 5,
                borderWidth: 1,
                paddingLeft: 10,
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={{ flex: 1, width: "100%", position: "relative" }}>
              <View>
                <Input
                  appTheme={theme}
                  textContentType="password"
                  placeholderTextColor="#c4c3cb"
                  placeholder={I18n.t("Form_Password")}
                  selectionColor={theme.focusColor}
                  ref={input => {
                    this.passwordInput = input;
                  }}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType={"send"}
                  onSubmitEditing={() => {
                    this.login();
                  }}
                  secureTextEntry
                  style={{
                    height: 43,
                    fontSize: 14,
                    borderRadius: 5,
                    borderWidth: 1,
                    paddingLeft: 10,
                    paddingRight: 66,
                    marginTop: 5,
                    marginBottom: 5
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState(state => ({
                    isDialogVisible: !state.isDialogVisible
                  }));
                }}
                style={{ zIndex: 3, position: "absolute", right: 10, top: 20 }}
              >
                <Text
                  style={{
                    color: theme.focusColor,
                    textTransform: "uppercase",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  {I18n.t("Form_ForgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
            <SpaceFive />
            <TouchableOpacity onPress={this.login}>
              <MainButton
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.75, y: 1.0 }}
                locations={[0, 1]}
                colors={["#4FCFD7", "#257CF3"]}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase"
                  }}
                >
                  {I18n.t("Auth_Login")}
                </Text>
              </MainButton>
            </TouchableOpacity>
            <SpaceFive />
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  marginBottom: 10,
                  color: theme.lightColor
                }}
              >
                {I18n.t("Auth_NotOnHeyYet")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState(state => ({ register: !state.register }))
              }
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: theme.focusColor
                }}
              >
                {I18n.t("Auth_Register")}
              </Text>
            </TouchableOpacity>
          </View>
          <Toast ref="toast" />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default connect(
  state => state,
  { loginUser, registerUser, resetPassword }
)(withTheme(Authentication));
