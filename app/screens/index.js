import React from "react";
import { Provider } from "react-redux";
import store from "hey-redux/store";
import { Navigation } from "react-native-navigation";
import { ThemeProvider, themes, withTheme } from "hey-theme";
import screenWrapper from "hey-screens/screenWrapper";

import Initialising from "hey-screens/Initialising";
import Authentication from "hey-screens/Authentication";
import Trends from "hey-screens/Trends";
import Home from "hey-screens/Home";
import Search from "hey-screens/Search";
import SearchGroups from "hey-screens/SearchGroups";
import SearchUser from "hey-screens/Conversations/Search";
import CreateCommunity from "hey-screens/CreateCommunity";
import EditCommunity from "hey-screens/EditCommunity";
import Subscriptions from "hey-screens/Subscriptions";
import Group from "hey-screens/Groups";
import ChannelRoom from "hey-screens/Groups/ChannelRoom";
import ChannelRoomSettings from "hey-screens/Groups/ChannelRoomSettings";
import ChatRoom from "hey-screens/Subscriptions/ChatRoom";
import ChatRoomSettings from "hey-screens/Subscriptions/ChatRoomSettings";
import Notifications from "hey-screens/Notifications";
import Conversations from "hey-screens/Conversations";
import PrivateChat from "hey-screens/Conversations/PrivateChat";
import Profile from "hey-screens/Profile";
import EditProfile from "hey-screens/Profile/Edit";
import User from "hey-screens/Profile/User";
import Modal from "hey-screens/Modals";
import Drawer from "hey-screens/Drawer";
import ChannelsDrawer from "hey-screens/ChannelsDrawer";
import Disconnected from "hey-screens/Disconnected";

registerScreens = _cb => {
  screenWrapper("Initialising", Initialising, store, Provider);
  screenWrapper("Authentication", Authentication, store, Provider);
  screenWrapper("Home", Home, store, Provider);
  screenWrapper("Trends", Trends, store, Provider);
  screenWrapper("Search", Search, store, Provider);
  screenWrapper("SearchGroups", SearchGroups, store, Provider);
  screenWrapper("SearchUser", SearchUser, store, Provider);
  screenWrapper("CreateCommunity", CreateCommunity, store, Provider);
  screenWrapper("EditCommunity", EditCommunity, store, Provider);
  screenWrapper("Subscriptions", Subscriptions, store, Provider);
  screenWrapper("Group", Group, store, Provider);
  screenWrapper("ChannelRoom", ChannelRoom, store, Provider);
  screenWrapper("ChannelRoomSettings", ChannelRoomSettings, store, Provider);
  screenWrapper("ChatRoom", ChatRoom, store, Provider);
  screenWrapper("ChatRoomSettings", ChatRoomSettings, store, Provider);
  screenWrapper("Notifications", Notifications, store, Provider);
  screenWrapper("Conversations", Conversations, store, Provider);
  screenWrapper("PrivateChat", PrivateChat, store, Provider);
  screenWrapper("User", User, store, Provider);
  screenWrapper("Profile", Profile, store, Provider);
  screenWrapper("EditProfile", EditProfile, store, Provider);
  screenWrapper("Modal", Modal, store, Provider);
  screenWrapper("Drawer", Drawer, store, Provider);
  screenWrapper("ChannelsDrawer", ChannelsDrawer, store, Provider);
  screenWrapper("Disconnected", Disconnected, store, Provider);
  _cb(() => {
    Navigation.setDefaultOptions({
      animations: {
        setRoot: {
          alpha: {
            from: 0,
            to: 1,
            duration: 300
          }
        },
        _push: {
          topBar: {
            id: "TEST",
            alpha: {
              from: 0,
              to: 1,
              duration: 500,
              interpolation: "accelerate"
            }
          },
          bottomTabs: {
            y: {
              from: 1000,
              to: 0,
              duration: 500,
              interpolation: "decelerate"
            },
            alpha: {
              from: 0,
              to: 1,
              duration: 500,
              interpolation: "decelerate"
            }
          },
          content: {
            y: {
              from: 1000,
              to: 0,
              duration: 500,
              interpolation: "accelerate"
            },
            alpha: {
              from: 0,
              to: 1,
              duration: 500,
              interpolation: "accelerate"
            }
          }
        },
        _pop: {
          topBar: {
            id: "TEST",
            alpha: {
              from: 1,
              to: 0,
              duration: 500,
              interpolation: "accelerate"
            }
          },
          bottomTabs: {
            y: {
              from: 0,
              to: 100,
              duration: 500,
              interpolation: "accelerate"
            },
            alpha: {
              from: 1,
              to: 0,
              duration: 500,
              interpolation: "accelerate"
            }
          },
          bottomTabs: {
            y: {
              from: 0,
              to: 100,
              duration: 500,
              interpolation: "decelerate"
            },
            alpha: {
              from: 1,
              to: 0,
              duration: 500,
              interpolation: "decelerate"
            }
          },
          content: {
            y: {
              from: 0,
              to: 1000,
              duration: 500,
              interpolation: "decelerate"
            },
            alpha: {
              from: 1,
              to: 0,
              duration: 500,
              interpolation: "decelerate"
            }
          }
        }
      },
      sideMenu: {
        left: {
          shouldStretchDrawer: false
        },
        // disabledOpenGesture: true,
        animationType: "slide" // defaults to none if not provided, options are 'parallax', 'door', 'slide', or 'slide-and-scale'
        // openGestureMode: "bezel" // "entireScreen" | "bezel"
      },
      layout: {
        backgroundColor: global.theme.appBackground
      },
      bottomTabs: {
        backgroundColor: global.theme.headerBackground,
        animate: false
      }
    });
    Navigation.setRoot({
      root: {
        component: {
          name: "Initialising"
        }
      }
    });
  });
};

module.exports = {
  registerScreens
};
