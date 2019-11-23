import React from "react";
import { connect } from "react-redux";
import {
  connectToSocket,
  appendMessage,
  messageDeleted
} from "hey-redux/actions/chat";
import {
  getCountUnread,
  getCountUnreadPM
} from "hey-redux/actions/notifications";
import {
  getSubscriptions,
  updateSubscriptions
} from "hey-redux/actions/subscriptions";

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chat.socket === undefined && this.props.chat.socket) {
      const { socket } = this.props.chat;

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

  componentDidMount() {
    this.props.getCountUnread();
    this.props.getCountUnreadPM();
    this.props.connectToSocket();
  }

  componentWillUnmount() {
    this.props.chat.socket.off("disconnect");
    // console.log("🚨 connection status removed");
    // NetInfo.removeEventListener(
    //   "connectionChange",
    //   this._handleConnectionChange
    // );
  }

  render() {
    return null;
  }
}

const AppWrapperModule = connect(
  state => state,
  {
    connectToSocket,
    getCountUnread,
    getCountUnreadPM,
    updateSubscriptions,
    appendMessage,
    messageDeleted
  }
)(AppWrapper);

export default AppWrapperModule;
