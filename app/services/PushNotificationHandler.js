import React, { Component } from "react";
import firebase from "react-native-firebase";
import { DEFAULT_API_URL } from "hey-mocks";
import {
  Ink,
  safeStringify,
  debounce,
  extractFromArray
} from "hey-mocks/helper";
import { reportBug } from "hey-resources/Bugs/index";
import { tabPush } from "hey-screens/navigation";
import { connect } from "react-redux";
import { getCurrentGroup } from "hey-redux/actions/groups";

class PushNotificationHandler extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // in app notification opened - not used
    // this.notificationDisplayedListener = firebase
    //   .notifications()
    //   .onNotificationDisplayed(notification => {
    //     // Process your notification as required
    //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    //     console.log(
    //       "NOTIFICATIONS notificationDisplayedListener:",
    //       notification
    //     );
    //     reportBug({
    //       message: safeStringify({
    //         title: "notificationDisplayedListener",
    //         notification
    //       }),
    //       token: this.props.authentication.token
    //     });
    //     this._processNotification(notification);
    //   });

    // in app notification
    // ADD BUBBLE TO NOTIFICATIONS UPDATE REDUX STATE
    // this.notificationListener = firebase
    //   .notifications()
    //   .onNotification(notification => {
    //     console.log("NOTIFICATIONS notificationListener:", notification);
    //     // Process your notification as required
    //     reportBug({
    //       message: safeStringify({
    //         title: "notificationListener",
    //         notification
    //       }),
    //       token: this.props.authentication.token
    //     });
    //     this._processNotification(notification);
    //   });

    // app in background opened
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        this._processNotification(notification);
      });

    // does not work in dev environment, to test in production
    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          this._processNotification(notification);
        }
      });
  }

  componentWillUnmount() {
    // this.notificationDisplayedListener();
    // this.notificationListener();
    this.notificationOpenedListener();
  }

  _processNotification = notification => {
    console.log("processing notification");
    // redirect to group and channel
    if (notification) {
      if (notification._data) {
        switch (notification._data.type) {
          case "channelChat.tagged":
          case "channelChat.like":
          case "channelChat.reply":
            // getgroup
            this.props.getCurrentGroup({
              group_id: notification._data.group,
              cb: r => {
                tabPush("ChannelRoom", {
                  channel: extractFromArray(
                    r.result.channels,
                    notification._data.channel,
                    "_id"
                  ),
                  group: r.result
                });
              }
            });
        }
      }
    }
  };

  render() {
    return null;
  }
}

export default connect(
  state => state,
  {
    getCurrentGroup
  }
)(PushNotificationHandler);
