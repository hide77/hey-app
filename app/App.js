import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform
} from "react-native";
import { getData } from "hey-mocks/AsyncStore";
import RNRestart from "react-native-restart";
import { connect } from "react-redux";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { STORAGE_KEY, FULL_SOCKET } from "hey-mocks";
import {
  connectToSocket,
  appendMessage,
  messageDeleted
} from "hey-redux/actions/chat";
import { getAuthenticatedUser } from "hey-redux/actions/user";
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
import { idx } from "hey-mocks/helper";
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
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tokenError: false, isConnected: -1 };
  }

  // _handleConnectionChange = connectionInfo => {
  //   NetInfo.isConnected.fetch().then(isConnected => {
  //     if (this.state.isConnected === false) {
  //       RNRestart.Restart();
  //     }
  //     this.setState({ isConnected });
  //   });
  // };

  componentDidMount() {
    if (!this.props.authentication.token) {
      this.loadTokenFromStorage(token => {
        this.props.getSubscriptions({
          reset: true,
          cb: async _subscriptions => {
            if (FULL_SOCKET) {
              // console.time("initSocket");
              await Promise.all(
                _subscriptions.map(async item => {
                  await this.props.chat.socket.emit("join", { site: item._id });
                })
              );
              // console.timeEnd("initSocket");
            }
          }
        });
      });
    }
    // NetInfo.addEventListener("connectionChange", this._handleConnectionChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.authentication.isAuthenticated !==
      this.props.authentication.isAuthenticated
    )
      this.props.getAuthenticatedUser();
  }

  componentWillUnmount() {
    // NetInfo.removeEventListener(
    //   "connectionChange",
    //   this._handleConnectionChange
    // );
  }

  async loadTokenFromStorage(_cb) {
    const result = await getData("token", { json: true });
    if (result !== null) {
      this.props.setToken(result.token);
      this.props.getAuthenticatedUser(result.token, () => {
        _cb(result.token);
      });
    } else {
      this.setState({ tokenError: true });
    }
  }

  render() {
    console.disableYellowBox = true;
    const token = this.props.authentication.token;
    const { theme } = this.props;
    if (this.state.isConnected === false) {
      return (
        <Disconnected appTheme={theme} restartApp={() => RNRestart.Restart()} />
      );
    }
    if (
      (!token && this.state.tokenError) ||
      this.props.authentication.loggedOut
    ) {
      return <Authentication />;
    }
    if (!token && !this.props.authentication.isAuthenticated) {
      return <Loading appTheme={theme} />;
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
    getSubscriptions
  }
)(withTheme(Main));
