import React from "react";
import { Platform } from "react-native";

export const tabNavigator = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: "Drawer",
          name: "Drawer",
          passProps: {
            text: "This is a left side menu screen"
          }
        }
      },
      center: {
        bottomTabs: {
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "TrendsScreen",
                      name: "Trends",
                      passProps: {
                        text: "This is tab 2"
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    icon: require("hey/img/menu-feed-off.png"),
                    selectedIcon: require("hey/img/menu-feed-on.png"),
                    testID: "FIRST_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "SubscriptionsScreen",
                      name: "Subscriptions",
                      passProps: {
                        text: "This is tab 2"
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    icon: require("hey/img/menu-sub-off.png"),
                    selectedIcon: require("hey/img/menu-sub-on.png"),
                    testID: "SECOND_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "NotificationsScreen",
                      name: "Notifications",
                      passProps: {
                        text: "This is tab 3"
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    // badge: '3',
                    icon: require("hey/img/menu-not-off.png"),
                    selectedIcon: require("hey/img/menu-not-on.png"),
                    testID: "THIRD_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "ConversationsScreen",
                      name: "Conversations",
                      passProps: {
                        text: "This is tab 4"
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    icon: require("hey/img/menu-chat-off.png"),
                    selectedIcon: require("hey/img/menu-chat-on.png"),
                    testID: "FOURTH_TAB_BAR_BUTTON"
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
};

export const groupsNavigator = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: "Drawer",
          name: "Drawer",
          passProps: {
            text: "This is a left side menu screen"
          }
        }
      },
      center: {
        stack: {
          children: [
            {
              component: {
                id: "Root",
                name: "Home",
                passProps: {
                  text: "This is tab 2"
                }
              }
            }
          ],
          options: {
            topBar: {
              visible: false,
              height: 0
            }
          }
        }
      },
      right: {
        component: {
          id: "ChannelsDrawer",
          name: "ChannelsDrawer",
          passProps: {
            text: "This is a left side menu screen"
          }
        }
      }
    }
  }
};

export const groupsTabsNavigator = {
  root: {
    sideMenu: {
      left: {
        component: {
          id: "Drawer",
          name: "Drawer",
          passProps: {
            text: "This is a left side menu screen"
          }
        }
      },
      center: {
        bottomTabs: {
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "Root",
                      name: "Home",
                      passProps: {
                        text: "This is tab 2"
                      },
                      options: {
                        topBar: {
                          visible: false,
                          height: 0
                        }
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    animate: false,
                    text: Platform.OS === 'ios' ? "" : "Home",
                    icon: require("hey/img/menu-feed-off.png"),
                    selectedIcon: require("hey/img/menu-feed-on.png"),
                    testID: "FIRST_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "SubscriptionsScreen",
                      name: "Subscriptions",
                      passProps: {
                        text: "This is tab 2"
                      },
                      options: {
                        topBar: {
                          visible: false,
                          height: 0
                        }
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    animate: false,
                    text: Platform.OS === 'ios' ? "" : "Favorites",
                    icon: require("hey/img/menu-sub-off.png"),
                    selectedIcon: require("hey/img/menu-sub-on.png"),
                    testID: "SECOND_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "NotificationsScreen",
                      name: "Notifications",
                      passProps: {
                        text: "This is tab 3"
                      },
                      options: {
                        topBar: {
                          visible: false,
                          height: 0
                        }
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    animate: false,
                    text: Platform.OS === 'ios' ? "" : "Notifications",
                    // badge: '3',
                    icon: require("hey/img/menu-not-off.png"),
                    selectedIcon: require("hey/img/menu-not-on.png"),
                    testID: "THIRD_TAB_BAR_BUTTON"
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: "ConversationsScreen",
                      name: "Conversations",
                      passProps: {
                        text: "This is tab 4"
                      },
                      options: {
                        topBar: {
                          visible: false,
                          height: 0
                        }
                      }
                    }
                  }
                ],
                options: {
                  topBar: {
                    visible: false,
                    height: 0
                  },
                  bottomTab: {
                    text: Platform.OS === 'ios' ? "" : "Messages",
                    animate: false,
                    icon: require("hey/img/menu-chat-off.png"),
                    selectedIcon: require("hey/img/menu-chat-on.png"),
                    testID: "FOURTH_TAB_BAR_BUTTON"
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
};
