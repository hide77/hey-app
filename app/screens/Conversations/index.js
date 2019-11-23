import React from "react";
import { tabPush } from "hey-screens/navigation";
import { connect } from "react-redux";
import { createStackNavigator } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { getPrivateChats } from "hey-redux/actions/chat";
import Header from "hey-components/Header";
import { Flex } from "hey-components/Common";
import NothingToShow from "hey-components/Common/NothingToShow";
import Conversation from "./Conversation";
import PrivateChat from "./PrivateChat";
import I18n from "hey-i18n";
import Search from "./Search";
import User from "hey-screens/Profile/User";
import Profile from "hey-screens/Profile";
import { withTheme } from "hey-theme";

class Conversations extends React.Component {
  state = {
    refreshing: false
  };

  componentDidMount() {
    this.props.getPrivateChats();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newData = nextProps.chat.type !== this.props.chat.type;
    const themeChanged = this.props.theme.name !== nextProps.theme.name;
    return newData || themeChanged;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getPrivateChats({ reset: true });
    this.setState({ refreshing: false });
  };

  render() {
    const { theme } = this.props;
    const messages = this.props.chat.privateChats;
    return (
      <Flex style={{ minHeight: "100%", backgroundColor: theme.appBackground }}>
        <Header
          parentComponent={this.props.componentId}
          userData={this.props.user.result}
          style={{ zIndex: 10 }}
          title={I18n.t("DirectMessages")}
          actions={[
            {
              postition: "right",
              type: "add",
              onPress: () => {
                tabPush("SearchUser");
              }
            }
          ]}
        />
        {messages && messages.length > 0 ? (
          <ScrollView
            style={{ zIndex: -3 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {messages.map(
              message =>
                message && (
                  <Conversation
                    appTheme={theme}
                    key={message.user.id}
                    message={message}
                  />
                )
            )}
          </ScrollView>
        ) : (
          <NothingToShow
            style={{ zIndex: -4 }}
            header={I18n.t("EmptyChatRoom.header")}
            title={I18n.t("EmptyChatRoom.title")}
            appTheme={theme}
          />
        )}
      </Flex>
    );
  }
}

export default connect(
  state => ({
    chat: state.chat,
    user: state.user
  }),
  { getPrivateChats }
)(withTheme(Conversations));
