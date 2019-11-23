import React from "react";
import {
  AppRegistry,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Provider } from "react-redux";
import App from "hey-app/App";
import { Wrapper } from "hey-components/Common";
import { name as appName } from "./app.json";
import { getData, storeData } from "hey-mocks/AsyncStore";
import store from "hey-redux/store";
import { ThemeProvider, themes, withTheme } from "hey-theme";

class WrappedApp extends React.Component {
  constructor(props) {
    super(props);

    getData(`THEME`).then(_theme => {
      if (_theme) {
        this.setState({ themeName: _theme, theme: themes[_theme] });
      }
    });
  }
  state = {
    themeName: "default",
    theme: themes.default
  };
  handleThemeChange = () => {
    let themeName = this.state.themeName === "default" ? "dark" : "default";
    this.setState({ theme: themes[themeName], themeName });
    storeData(`THEME`, themeName);
  };
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme}>
          <StatusBar barStyle={this.state.theme.barStyle} />
          <Wrapper appTheme={this.state.theme}>
            <App onChangeTheme={this.handleThemeChange} />
          </Wrapper>
        </ThemeProvider>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => withTheme(WrappedApp));
