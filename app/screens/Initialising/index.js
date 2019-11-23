import React from "react";
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform
} from "react-native";
import SplashScreen from "react-native-splash-screen";
import firebase from "react-native-firebase";
import { DEFAULT_API_URL } from "hey-mocks";
import {
  Ink,
  safeStringify,
  debounce,
  idx,
  extractFromArray
} from "hey-mocks/helper";
import { reportBug } from "hey-resources/Bugs/index";
import {
  tabPush,
  goToAuth,
  goHome,
  goDisconnected,
  joinAndOpenGroup
} from "hey-screens/navigation";
import {
  getGroups,
  getJoinedGroups,
  getCurrentGroup
} from "hey-redux/actions/groups";
import { getData, storeData } from "hey-mocks/AsyncStore";
import { connect } from "react-redux";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { STORAGE_KEY, FULL_SOCKET } from "hey-mocks";
import { connectToSocket } from "hey-redux/actions/io";
import { appendMessage, messageDeleted } from "hey-redux/actions/chat";
import { getAuthenticatedUser } from "hey-redux/actions/user";
import { getPlaylists } from "hey-redux/actions/playlists";
import {
  getSubscriptions,
  updateSubscriptions
} from "hey-redux/actions/subscriptions";
import {
  getCountUnread,
  getCountUnreadPM
} from "hey-redux/actions/notifications";
import { setToken } from "hey-redux/actions/authentication";
import Authentication from "hey-screens/Authentication";
import Disconnected from "hey-screens/Disconnected";
import Home from "hey-containers";
import { Loading } from "hey-components/Common/Loading";
import { withTheme } from "hey-theme";
import _ from "lodash";
import "react-native-console-time-polyfill";
import enableFontPatch from "hey-mocks/enableFontPatch";
enableFontPatch();

// ███╗   ███╗ █████╗ ██╗███╗   ██╗
// ████╗ ████║██╔══██╗██║████╗  ██║
// ██╔████╔██║███████║██║██╔██╗ ██║
// ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
// ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
class Initialising extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appInitialised: false,
      appInitialisedTimeout: setTimeout(this._initApp, 7000),
      tokenError: false
    };
  }

  _initPushNotifications = () => {
    debounce(() => {
      const getTokenAndUpdateUserData = () => {
        firebase
          .messaging()
          .getToken()
          .then(token => {
            if (token) {
              if (
                !idx(["user", "result", "device_tokens"], this.props) ||
                !idx(["user", "result", "device_tokens"], this.props).includes(
                  token
                )
              ) {
                fetch(`${DEFAULT_API_URL}/v1/me`, {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${this.props.authentication.token}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    device_token: token
                  })
                }).then(() => {
                  console.log("🎾PUSH NOTIFICATIONS: registered");
                });
              } else {
                console.log("🎾PUSH NOTIFICATIONS: already registered");
              }
            } else {
              console.log("🎾PUSH NOTIFICATIONS: device not found");
            }
          });
      };

      firebase
        .messaging()
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            // user has permissions
            console.log("🎾PUSH NOTIFICATIONS: enabled");
            getTokenAndUpdateUserData();
          } else {
            // user doesn't have permission
            console.log("🎾PUSH NOTIFICATIONS: not enabled");
            try {
              console.log("🎾PUSH NOTIFICATIONS: permission asked");
              firebase
                .messaging()
                .requestPermission()
                .then(() => {
                  // permission granted
                  console.log("🎾PUSH NOTIFICATIONS: permission granted");
                  // continue
                  getTokenAndUpdateUserData();
                })
                .catch(() => {
                  console.log("🎾PUSH NOTIFICATIONS: permission denied");
                  // permission not granted
                  // maybe ask to go to settings or add banner somewhere
                });
            } catch (error) {
              // permission denied
              console.log("🎾PUSH NOTIFICATIONS: permission denied");
            }
          }
        });
    }, 1000)();
  };

  _initApp = () => {
    this._bootstrap(() => {
      if (!this.state.appInitialised) {
        clearTimeout(this.state.appInitialisedTimeout);
        this.setState({ appInitialised: true });
        SplashScreen.hide();
      }
    });
  };

  _initToken = () => {
    if (!this.props.authentication.token) {
      this.loadTokenFromStorage(token => {
        if (token) {
          this._initUser(token);
        } else {
          this._initApp();
        }
      });
    } else {
      this._initUser(this.props.authentication.token);
    }
  };

  _initUser = token => {
    if (!idx(["result", "_id"], this.props.user)) {
      this.props.getAuthenticatedUser(token, this._manageSocket);
    } else {
      this._manageSocket();
    }
  };

  _manageSocket = () => {
    this._initPushNotifications();
    this.props.getCountUnread();
    this.props.getCountUnreadPM();
    this.props.connectToSocket();
    this.props.getGroups({
      cb: () => {
        this.props.getJoinedGroups({
          cb: () => {
            this.props.getPlaylists({ cb: this._initApp })();
          }
        });
      }
    });
  };

  _bootstrap = (_next = () => {}) => {
    if (global.open_group && global.open_group.id) {
      console.log("join and open group", global.open_group);
      joinAndOpenGroup(global.open_group, this.props.authentication.token);
    }
    _next();
  };

  componentDidMount() {
    this._initToken();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.authentication.isAuthenticated !==
      this.props.authentication.isAuthenticated
    ) {
      this.props.getAuthenticatedUser(this._initApp);
    }

    if (!prevProps.io.socket && this.props.io.socket) {
      // console.log("📡 socket.io", this.props.io.socket);
      const { socket } = this.props.io;

      if (socket) {
        socket.on("disconnect", () => {
          console.log("⚠️ Disconnected");
          const token = this.props.authentication.token;
          this.props.connectToSocket();
        });

        socket.on("newNotifications", _data => {
          console.log("new not", _data);
          this.props.getCountUnread(_data.count);
        });

        socket.on("newPrivateMessages", _data => {
          console.log("new PM", _data);
          this.props.getCountUnreadPM(_data.count);
        });

        socket.on("privateMessage", _data => {
          console.log("new msg", _data);
        });

        if (FULL_SOCKET) {
          socket.on("message", msg => {
            console.log("new msg", msg);
            if (!msg) return;
            if (
              idx(["host", "_id"], this.props.chat) &&
              idx(["host", "_id"], this.props.chat) === msg.site._id
            ) {
              this.props.appendMessage(msg);
            }
            this.props.updateSubscriptions(msg);
          });

          socket.on("deletedMessage", data => {
            if (
              data &&
              idx(["host", "_id"], this.props.chat) &&
              idx(["host", "_id"], this.props.chat) === data.site
            ) {
              this.props.messageDeleted(data.message);
            }
          });
        }
      }
    }
  }

  async loadTokenFromStorage(_cb) {
    const result = await getData("token", { json: true });
    if (result !== null) {
      this.props.setToken(result.token);
      _cb(result.token);
    } else {
      this.setState({ tokenError: true }, _cb);
    }
  }

  render() {
    console.disableYellowBox = true;
    const token = this.props.authentication.token;
    const { theme } = this.props;
    if (!this.state.appInitialised) {
      return null;
    } else if (
      (!token && this.state.tokenError) ||
      this.props.authentication.loggedOut
    ) {
      goToAuth();
      return null;
    } else if (!token && !this.props.authentication.isAuthenticated) {
      goToAuth();
      return null;
    } else {
      goHome();
      return null;
    }
  }
}

export default connect(
  state => state,
  {
    getAuthenticatedUser,
    setToken,
    getCountUnread,
    getCountUnreadPM,
    getSubscriptions,
    connectToSocket,
    updateSubscriptions,
    appendMessage,
    messageDeleted,
    getPlaylists,
    getGroups,
    getJoinedGroups,
    getCurrentGroup
  }
)(withTheme(Initialising));
