import { Navigation } from "react-native-navigation";
import {
  groupsNavigator,
  groupsTabsNavigator
} from "hey-screens/rootNavigation";
import { CONFIG } from "hey-mocks";

const tabNames = [
  "Root",
  "SubscriptionsScreen",
  "NotificationsScreen",
  "ConversationsScreen"
];
const bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(
  ({ selectedTabIndex, unselectedTabIndex }) => {
    console.log("bottom tab pressed", selectedTabIndex);
    global.last_tab = tabNames[selectedTabIndex];
  }
);
const showLeftSideMenuIn = ["Home"];
const showRightSideMenuIn = ["ChannelRoom"];
// const screenEventListener = Navigation.events().registerComponentDidAppearListener(
//   ({ componentId, componentName, passProps }) => {
//     console.log(`📱 screen ${componentName}`);
//     if (showLeftSideMenuIn.indexOf(componentName) > -1) {
//       // show Left side menu
//
//       Navigation.mergeOptions(componentId, {
//         sideMenu: {
//           left: {
//             enabled: true
//           }
//         }
//       });
//     } else {
//       //hide it
//       Navigation.mergeOptions(componentId, {
//         sideMenu: {
//           left: {
//             enabled: false
//           }
//         }
//       });
//     }
//     if (showRightSideMenuIn.indexOf(componentName) > -1) {
//       // show Right side menu
//       Navigation.mergeOptions(componentId, {
//         sideMenu: {
//           right: {
//             enabled: true
//           }
//         }
//       });
//     } else {
//       //hide it
//       Navigation.mergeOptions(componentId, {
//         sideMenu: {
//           right: {
//             enabled: false
//           }
//         }
//       });
//     }
//   }
// );

export const push = (currentScreen, screenName, _props = {}) => {
  Navigation.push(currentScreen, {
    component: {
      name: screenName,
      passProps: {
        stateParams: _props
      }
    }
  });
};

export const tabPush = (screenName, _props = {}) => {
  if (global.last_tab) {
    console.log("lasttab", global.last_tab);
    Navigation.push(global.last_tab, {
      component: {
        name: screenName,
        passProps: {
          stateParams: _props
        }
      }
    });
  }
};

export const pop = currentScreen => {
  Navigation.pop(currentScreen);
};

export const popToRoot = currentScreen => {
  Navigation.popToRoot(currentScreen);
};

export const openDrawer = () => {
  Navigation.mergeOptions("Drawer", {
    sideMenu: {
      left: {
        visible: true
      }
    }
  });
};

export const openChannelsDrawer = passProps => {
  Navigation.mergeOptions("ChannelsDrawer", {
    sideMenu: {
      right: {
        visible: true,
        component: {
          name: "ChannelsDrawer",
          passProps
        }
      }
    }
  });
};

export const pushFromDrawer = _to => {
  Navigation.mergeOptions("Drawer", {
    sideMenu: {
      left: {
        visible: false
      }
    }
  });
  Navigation.push(global.last_tab, {
    component: {
      name: _to
    }
  });
};

export const pushFromChannelsDrawer = () => {
  Navigation.mergeOptions("ChannelsDrawer", {
    sideMenu: {
      right: {
        visible: false
      }
    }
  });
};

export const joinAndOpenGroup = (openGroup, userToken) => {
  if (global.isConnected || CONFIG.allowOffline) {
    const _openGroup = openGroup ? openGroup : global.open_group;
    if (_openGroup && userToken) {
      Navigation.push(global.last_tab, {
        component: {
          name: "Home",
          passProps: {
            stateParams: {
              _openGroup
            }
          }
        }
      });
    }
  } else {
    goDisconnected();
  }
};

export const goToAuth = () => {
  if (global.isConnected || CONFIG.allowOffline) {
    Navigation.setRoot({
      root: {
        component: {
          name: "Authentication"
        }
      }
    });
  } else {
    goDisconnected();
  }
};

export const goDisconnected = () =>
  Navigation.setRoot({
    root: {
      component: {
        name: "Disconnected"
      }
    }
  });

export const goHome = () => {
  if (global.isConnected || CONFIG.allowOffline) {
    // global.last_tab = tabNames[0];
    Navigation.setRoot(groupsTabsNavigator);
  } else {
    goDisconnected();
  }
};

export const goInit = () => {
  Navigation.setRoot({
    root: {
      component: {
        name: "Initialising"
      }
    }
  });
};
