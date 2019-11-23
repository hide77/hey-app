import React from "react";
import { connect } from "react-redux";
import {
  updateMe,
  uploadNewProfilePicture,
  getAuthenticatedUser
} from "hey-redux/actions/user";
import {
  Alert,
  Share,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  View,
  Text,
  RefreshControl
} from "react-native";
import { pop, tabPush } from "hey-screens/navigation";
import styled from "styled-components/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-action-sheet";
import getColorFromString from "hey-mocks/getColorFromString";
import images from "hey-mocks/images";
import getRank from "hey-mocks/getRank";
import { logoutUser } from "hey-redux/actions/authentication";
import I18n from "hey-i18n";
import Header from "hey-components/Header";
import UserPicture from "hey-components/UserPicture";
import { Loading } from "hey-components/Common/Loading";
import { withTheme } from "hey-theme";
import {
  Wrapper,
  Card,
  CardHeader,
  CardSubheader,
  PointsButton,
  InviteButton,
  Score,
  ScoreContainer,
  ScoreText,
  ActionButton,
  ActionText,
  Username,
  Subtitle,
  SpaceFive,
  Shadow,
  BigPicture
} from "hey-components/Common";

const userMenu = (toggleEdit, logoutUser) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: [I18n.t("EditProfile"), I18n.t("Logout"), I18n.t("Cancel")],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: I18n.t("Settings"),
      message: I18n.t("WhatDoYouWantToDo")
    },
    buttonId => {
      if (buttonId === 0) toggleEdit();
      if (buttonId === 1) {
        Alert.alert(I18n.t("Logout"), I18n.t("AreYouSureYouWantToLogOut"), [
          {
            text: I18n.t("No"),
            style: "cancel"
          },
          {
            text: I18n.t("Yes"),
            onPress: () => logoutUser()
          }
        ]);
      }
    }
  );
};

class Profile extends React.Component {
  state = { refreshing: false };

  componentDidMount() {
    if (!this.props.user || !this.props.user.result)
      this.props.getAuthenticatedUser();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.props.getAuthenticatedUser(null, r => {
        this.setState({ refreshing: false });
      });
    });
  };

  render() {
    const { theme } = this.props;
    if (!this.props.user || !this.props.user.result)
      return <Loading appTheme={theme} />;
    return (
      <Wrapper appTheme={theme}>
        <Header
          appTheme={theme}
          title={this.props.user.result.username}
          actions={[
            {
              postition: "right",
              type: "settings",
              onPress: () => {
                userMenu(() => {
                  tabPush("EditProfile");
                }, this.props.logoutUser);
              }
            },
            {
              postition: "left",
              type: "back",
              onPress: () => {
                pop(this.props.componentId);
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
          <Card>
            <CardHeader style={{ marginTop: 16 }}>
              <View style={{ flex: 1, margin: 14 }}>
                <ScoreContainer>
                  <Score>
                    <ScoreText appTheme={theme} big>
                      {this.props.user.result.nb_followings}
                    </ScoreText>
                    <ScoreText
                      appTheme={theme}
                      style={{ textTransform: "uppercase", fontSize: 10 }}
                    >
                      {I18n.t("Following")}
                    </ScoreText>
                  </Score>
                </ScoreContainer>
              </View>
              <UserPicture size={100} user={this.props.user.result} />
              <View style={{ flex: 1, margin: 14 }}>
                <ScoreContainer>
                  <Score>
                    <ScoreText appTheme={theme} big>
                      {this.props.user.result.nb_followers}
                    </ScoreText>
                    <ScoreText
                      appTheme={theme}
                      style={{ textTransform: "uppercase", fontSize: 10 }}
                    >
                      {I18n.t("Followers")}
                    </ScoreText>
                  </Score>
                </ScoreContainer>
              </View>
            </CardHeader>
            <CardSubheader>
              <Username>
                <Subtitle appTheme={theme} big>
                  {this.props.user.result.username}
                </Subtitle>
                <View style={{ width: 8 }} />
                {images[getRank(this.props.user.result.karma)]}
              </Username>
              <SpaceFive />
              <Subtitle appTheme={theme} bio>
                {this.props.user.result.bio}
              </Subtitle>
              <SpaceFive />
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }} />
                <PointsButton
                  style={{ marginTop: 20, flex: 3, flexDirection: "row" }}
                >
                  {images.coin}
                  <Text
                    style={{
                      color: theme.mainColor,
                      fontSize: 40,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    {this.props.user.result.karma}
                  </Text>
                </PointsButton>
                <View style={{ flex: 1 }} />
              </View>
              <SpaceFive />
              <Subtitle appTheme={theme} bio style={{ marginTop: 30 }}>
                Share your invite code with a friend and earn{" "}
                <Text style={{ fontWeight: "bold" }}>10 points</Text> when they
                sign up using your code. Share with as many friends as you like
                to earn more.
              </Subtitle>
              <SpaceFive />
              <TouchableOpacity
                onPress={() =>
                  Share.share({
                    title: "I'm waiting for you..",
                    message: `👋 Hey! join me on Hey! https://install.hey.network and enter my referral code: ${
                      this.props.user.result.referral
                    }`
                  })
                }
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <InviteButton
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.75, y: 1.0 }}
                    locations={[0, 1]}
                    colors={["#4FCFD7", "#257CF3"]}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {this.props.user.result.referral}
                    </Text>
                    {images.invite}
                  </InviteButton>
                </View>
              </TouchableOpacity>
            </CardSubheader>
          </Card>
        </ScrollView>
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  { updateMe, uploadNewProfilePicture, getAuthenticatedUser, logoutUser }
)(withTheme(Profile));
