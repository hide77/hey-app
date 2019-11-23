import React from "react";
import { NetInfo, Linking } from "react-native";
import RNRestart from "react-native-restart";
import { Navigation } from "react-native-navigation";
import { themes } from "hey-theme";
import { getData } from "hey-mocks/AsyncStore";
import { CONFIG } from "hey-mocks";
import { registerScreens } from "hey-screens";
import { goDisconnected, joinAndOpenGroup } from "hey-screens/navigation";
import { DEEP_LINK } from "hey-mocks/types";
import store from "hey-redux/store";
import { idx } from "hey-mocks/helper";
global.godMode = false;

Navigation.events().registerAppLaunchedListener(() => {
  registerScreens(_cb => {
    // BOOTSTRAP
    // handle connection
    global.isConnected = -1;
    _handleConnectionChange = isConnected => {
      if (global.isConnected === false) {
        RNRestart.Restart();
      } else if (!isConnected && !CONFIG.allowOffline) {
        goDisconnected();
      }
      global.isConnected = isConnected;
    };

    NetInfo.isConnected.addEventListener("change", _handleConnectionChange);

    // handle open link
    Linking.addEventListener("url", event => {
      if (event && event.url && event.url.indexOf(DEEP_LINK) === 0) {
        let code = event.url.substr(DEEP_LINK.length);
        console.log("pid", code);
        // if private, join group first with shareToken
        // if public, join group
        // redirect to group with id
        const openGroup = {
          id: code.split("/")[1],
          token: code.split("/")[2],
          private: code.split("/")[0] === "private"
        };
        // check if connected, if not, store and try again when connected.
        const _token = idx(["authentication", "token"], store.getState());
        if (_token) {
          // continue
          console.log("joining and opening group");
          joinAndOpenGroup(openGroup, _token);
        } else {
          console.log("saving group data for after auth");
          global.open_group = openGroup;
        }
      }
    });
    // handle navigation
    global.last_tab = "Root";
    // handle theme
    global.themeName = "default";
    global.theme = themes[global.themeName];
    getData(`themeName`).then(_theme => {
      if (_theme && themes[_theme]) {
        global.themeName = _theme;
        global.theme = themes[_theme];
      }
      _cb();
    });
  });
});
