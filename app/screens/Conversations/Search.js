import React from "react";
import { pop } from "hey-screens/navigation";
import { ScrollView, View } from "react-native";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { inviteUser } from "hey-redux/actions/invitations";
import { searchUser } from "hey-redux/actions/user";
import { Header, HeaderItems, Input, Wrapper } from "hey-components/Common";
import UserDoesNotExist from "hey-components/UserDoesNotExist";
import UserCard from "hey-components/UserCard";
import { withTheme } from "hey-theme";

class Search extends React.Component {
  state = { username: "" };

  onChangeText(username) {
    this.setState({ username });
    if (username.length > 2) this.props.searchUser(username);
  }

  render() {
    const { theme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header appTheme={theme}>
          <HeaderItems>
            <Ionicons
              name="md-arrow-back"
              color={theme.lightColor}
              size={28}
              style={{ marginHorizontal: 20, fontWeight: "bold", flex: 0 }}
              onPress={() => pop(this.props.componentId)}
            />
            <Input
              appTheme={theme}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search users"
              placeholderTextColor={theme.lightColor}
              onChangeText={username => this.onChangeText(username)}
              value={this.state.username}
              style={{ flex: 1 }}
            />
          </HeaderItems>
        </Header>
        {this.state.username.length > 0 && (
          <ScrollView keyboardShouldPersistTaps="always">
            {this.props.user.searchedUsers.length > 0 ? (
              this.props.user.searchedUsers.map(user => (
                <UserCard appTheme={theme} key={user._id} user={user} conversation />
              ))
            ) : (
              <UserDoesNotExist
                appTheme={theme}
                inviteUser={this.props.inviteUser}
                username={this.state.username}
              />
            )}
          </ScrollView>
        )}
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  { searchUser, inviteUser }
)(withTheme(Search));
