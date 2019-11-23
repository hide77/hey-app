import React from "react";
import { push, pop } from "hey-screens/navigation";
import { RefreshControl, View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DEFAULT_API_URL } from "hey-redux/mocks";
import { followUser } from "hey-redux/actions/followers";
import UserDetail from "./UserDetail";
import Header from "hey-components/Header";
import { Loading } from "hey-components/Common/Loading";
import { withTheme } from "hey-theme";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, refreshing: false };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    const token = this.props.authentication.token;
    fetch(`${DEFAULT_API_URL}/v1/users/${this.props.stateParams.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          this.setState({ user: r.result });
        }
      });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getUser();
    this.setState({ refreshing: false });
  };

  render() {
    const { theme } = this.props;
    if (!this.state.user) return <Loading appTheme={theme} />;

    return (
      <View style={{ flex: 1, backgroundColor: theme.appBackground }}>
        <Header
          title={this.state.user.username}
          actions={[
            {
              postition: "left",
              type: "back",
              onPress: () => {
                pop(this.props.componentId);
              }
            },
            {
              postition: "right",
              type: "message",
              onPress: () => {
                push(this.props.componentId, "PrivateChat", {
                  id: this.state.user._id,
                  private: true,
                  user: this.state.user.username
                });
              }
            }
          ]}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {this.state.refreshing && <Loading appTheme={theme} />}
          <UserDetail
            appTheme={theme}
            user={this.state.user}
            follow={() => {
              this.props.followUser(this.state.user._id);
              this.setState(state => ({
                user: {
                  ...state.user,
                  nb_followers:
                    state.user.nb_followers + (state.user.following ? -1 : +1),
                  following: !state.user.following
                }
              }));
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => state,
  { followUser }
)(withTheme(User));
