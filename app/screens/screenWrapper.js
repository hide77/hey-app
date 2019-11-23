import React, { Component } from "react";
import { KeyboardAvoidingView, SafeAreaView, StatusBar } from "react-native";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import { ThemeProvider, themes, withTheme } from "hey-theme";
import { Wrapper } from "hey-components/Common";
import { getData, storeData } from "hey-mocks/AsyncStore";
import RNRestart from "react-native-restart";

export function screenWrapper(containerName, comp, store, Provider) {
  const generatorWrapper = function() {
    const InternalComponent = comp;

    return class Scene extends Component {
      constructor(props) {
        super(props);

        this.state = {
          themeName: global.themeName,
          theme: themes[global.themeName]
        };
      }

      _handleThemeChange = () => {
        let themeName = this.state.themeName === "default" ? "dark" : "default";
        storeData(`themeName`, themeName).then(() => {
          RNRestart.Restart();
        });
      };

      render() {
        return (
          <Provider store={store}>
            <ThemeProvider theme={this.state.theme}>
              <StatusBar barStyle={this.state.theme.barStyle} />
              <SafeAreaView
                style={{
                  flex: 1,
                  backgroundColor: this.state.theme.headerBackground
                }}
              >
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Wrapper appTheme={this.state.theme}>
                    <InternalComponent
                      ref="child"
                      {...this.props}
                      onChangeTheme={this._handleThemeChange}
                    />
                  </Wrapper>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </ThemeProvider>
          </Provider>
        );
      }
    };
  };

  registerContainer(containerName, generatorWrapper);
}

function registerContainer(containerName, generator) {
  Navigation.registerComponent(containerName, generator);
}

export default screenWrapper;
