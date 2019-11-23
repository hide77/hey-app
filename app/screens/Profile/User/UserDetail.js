import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import I18n from "hey-i18n";
import {
  Card,
  CardHeader,
  CardSubheader,
  Score,
  ScoreContainer,
  ScoreText,
  ActionButton,
  ActionText,
  InviteButton,
  Username,
  Subtitle,
  SpaceFive,
  Shadow,
  BigPicture
} from "hey-components/Common";
import UserPicture from "hey-components/UserPicture";
import images from "hey-mocks/images";
import getColorFromString from "hey-mocks/getColorFromString";
import getRank from "hey-mocks/getRank";

export default ({
  user,
  follow,
  logoutUser,
  edit,
  toggleEdit,
  appTheme: theme
}) => (
  <View style={{ flex: 1 }}>
    <Card>
      <CardHeader>
        <View style={{ flex: 1, margin: 14 }}>
          <ScoreContainer>
            <Score>
              <ScoreText appTheme={theme} big>
                {user.nb_followings}
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
        <UserPicture size={100} user={user} />
        <View style={{ flex: 1, margin: 14 }}>
          <ScoreContainer>
            <Score>
              <ScoreText appTheme={theme} big>
                {user.nb_followers}
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
            {user.username}
          </Subtitle>
          <View style={{ width: 8 }} />
          {images[getRank(user.karma)]}
        </Username>
        <SpaceFive />
        <Subtitle appTheme={theme} bio>
          {user.bio}
        </Subtitle>
        <SpaceFive />
        <TouchableOpacity onPress={follow}>
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
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {user.following ? "Following" : "Follow"}
            </Text>
          </InviteButton>
        </TouchableOpacity>
      </CardSubheader>
    </Card>
  </View>
);
