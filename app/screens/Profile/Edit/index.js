import React from "react";
import {
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  View,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { pop } from "hey-screens/navigation";
import { updateMe, uploadNewProfilePicture } from "hey-redux/actions/user";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import I18n from "hey-i18n";
import { Input, EditPicture, Wrapper } from "hey-components/Common";
import Header from "hey-components/Header";
import { withTheme } from "hey-theme";
import { idx } from "hey-mocks/helper";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    state = { user: { username: "", bio: "", picture: "" } };
  }
  componentDidMount() {
    this.setState({
      user: {
        username: idx(["result", "username"], this.props.user, ""),
        bio: idx(["result", "bio"], this.props.user, ""),
        picture: idx(["result", "pictures", "default"], this.props.user, "")
      }
    });
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true
    };
    const MAX_IMG_SIZE = 400;
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        ImageResizer.createResizedImage(
          response.uri,
          MAX_IMG_SIZE,
          MAX_IMG_SIZE,
          "JPEG",
          80
        )
          .then(compressed => {
            this.uploadImage({
              fileName: compressed.name,
              type: "JPEG",
              uri: compressed.uri
            });
          })
          .catch(err => {
            this.uploadImage(response);
          });
      }
    });
  };

  uploadImage = response => {
    if (response.uri) {
      const data = new FormData();

      data.append("file", {
        name: response.fileName,
        type: response.type,
        uri:
          Platform.OS === "android"
            ? response.uri
            : response.uri.replace("file://", "")
      });

      this.props.uploadNewProfilePicture(data);
    }
  };

  render() {
    const editPictureSize = 100;
    const { theme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header
          title={"Edit Profile"}
          actions={[
            {
              postition: "left",
              type: "text",
              text: {
                content: I18n.t("Cancel"),
                style: {
                  color: theme.lightColor,
                  fontSize: 16
                }
              },
              onPress: () => {
                pop(this.props.componentId);
              }
            },
            {
              postition: "right",
              type: "text",
              text: {
                content: I18n.t("Done"),
                style: {
                  color: theme.focusColor,
                  fontWeight: "bold",
                  fontSize: 16
                }
              },
              onPress: () => {
                this.props.updateMe(this.state.user, _error => {
                  if (_error) {
                    Alert.alert(
                      I18n.t("Profile.Oops"),
                      I18n.t("Profile.UsernameAlreadyExists"),
                      [
                        {
                          text: I18n.t("Ok")
                        }
                      ]
                    );
                  } else {
                    this.props.goBack();
                  }
                });
              }
            }
          ]}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ margin: 24 }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  marginBottom: 12,
                  width: editPictureSize,
                  borderRadius: editPictureSize / 2,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: theme.lightColor
                }}
              >
                <TouchableOpacity onPress={this.handleChoosePhoto}>
                  <EditPicture
                    pictureSize={editPictureSize}
                    profile
                    source={{
                      uri: idx(["user", "picture"], this.state)
                        ? this.state.user.picture.indexOf("http") === 0
                          ? `${this.state.user.picture}`
                          : `https://${this.state.user.picture}`
                        : ""
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.handleChoosePhoto}>
                <Text style={{ color: theme.focusColor }}>
                  Change profile photo
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.lightColor }}>
                {I18n.t("Form_Username")}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  borderWidth: 1,
                  borderColor: theme.lightColor,
                  borderRadius: 4
                }}
              >
                <Input
                  appTheme={theme}
                  textContentType="nickname"
                  placeholderTextColor={theme.lightColor}
                  placeholder="username"
                  onChangeText={username =>
                    this.setState({ user: { username } })
                  }
                  value={idx(["user", "username"], this.state)}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.lightColor }}>
                {I18n.t("Profile.aboutYou")}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  borderWidth: 1,
                  borderColor: theme.lightColor,
                  borderRadius: 4,
                  maxHeight: 160
                }}
              >
                <Input
                  appTheme={theme}
                  textAlignVertical="top"
                  placeholderTextColor={theme.lightColor}
                  placeholder="Write a few lines about you"
                  onChangeText={bio => this.setState({ bio })}
                  value={idx(["user", "bio"], this.state)}
                  maxLength={240}
                  multiline
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  { updateMe, uploadNewProfilePicture }
)(withTheme(EditProfile));
