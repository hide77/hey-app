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
import { pop, push, popToRoot } from "hey-screens/navigation";
import { DEFAULT_API_URL } from "hey-mocks";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import I18n from "hey-i18n";
import { getJoinedGroups, updateGroup } from "hey-redux/actions/groups";
import { Input, EditPicture, Wrapper } from "hey-components/Common";
import Header from "hey-components/Header";
import { withTheme } from "hey-theme";
import { CONFIG } from "hey-mocks";
import { idx } from "hey-mocks/helper";

class EditCommunity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: idx(["groups", "currentGroup", "name"], this.props, ""),
      description: idx(
        ["groups", "currentGroup", "description"],
        this.props,
        ""
      ),
      privateGroup: false,
      pictures: idx(["groups", "currentGroup", "pictures"], this.props, {}),
      question: idx(["groups", "currentGroup", "question"], this.props, "")
    };
  }

  _popToTop = () => {
    popToRoot(this.props.componentId);
  };

  _updateCommunity = (_data, _cb) => {
    _data.cb = r => {
      if (!r || !r.success) {
        console.log("aoutch group not updated:", r);
        _cb(true);
      } else {
        console.log("group updated:", { _data, r });
        _cb(false, r.result);
      }
    };
    _data.group_id = this.props.groups.currentGroup._id;
    this.props.updateGroup(_data);
  };

  handleChoosePhoto = () => {
    const options = {
      title: '"A picture is worth a thousand words.."',
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else if (response.uri) {
        // https://github.com/bamlab/react-native-image-resizer
        const MAX_IMG_SIZE = 1000;
        ImageResizer.createResizedImage(
          response.uri,
          MAX_IMG_SIZE,
          MAX_IMG_SIZE,
          "JPEG",
          60
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

      fetch(`${DEFAULT_API_URL}/v1/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.authentication.token}`
        },
        body: data
      })
        .then(j => j.json())
        .then(r => {
          if (r.success) {
            this.setState({
              pictures: {
                default: `https://${r.result}`
              }
            });
          }
        });
    }
  };

  render() {
    const editPictureSize = 100;
    const { theme } = this.props;
    return (
      <Wrapper appTheme={theme}>
        <Header
          title={"Edit Community"}
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
              onPress: this._popToTop
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
                this._updateCommunity(this.state, (_error, _group) => {
                  if (_error) {
                    // manage Errors
                    Alert.alert(
                      I18n.t("Profile.Oops"),
                      "This community already exists. Try with another name.",
                      [
                        {
                          text: I18n.t("Ok")
                        }
                      ]
                    );
                  } else {
                    // get joinedGroups
                    // this.props.getJoinedGroups({
                    //   cb: r => {
                    //     console.log("pushing", r);
                    //     push("Root", "Group", {
                    //       group: _group
                    //     });
                    //   }
                    // });
                    pop(this.props.componentId);
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
                      uri: this.state.pictures && this.state.pictures.default
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.handleChoosePhoto}>
                <Text style={{ color: theme.focusColor }}>Change Picture</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.lightColor }}>
                {I18n.t("Form_Name")}
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
                  textContentType="name"
                  placeholderTextColor={theme.lightColor}
                  placeholder={I18n.t("Form_Name")}
                  onChangeText={name => this.setState({ name })}
                  value={this.state.name}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.lightColor }}>
                {I18n.t("Form_Description")}
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
                  placeholder="Write a few lines about the community"
                  onChangeText={description => this.setState({ description })}
                  value={this.state.description}
                  multiline
                />
              </View>
            </View>
            {false && CONFIG.allow_private_groups && (
              <View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: theme.lightColor,
                    borderRadius: 4,
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        privateGroup: true
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: 10,
                      backgroundColor: this.state.privateGroup
                        ? theme.lightColor
                        : "transparent"
                    }}
                  >
                    <Text
                      style={{ textAlign: "center", color: theme.mainColor }}
                    >
                      Private
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        privateGroup: false
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: 10,
                      backgroundColor: !this.state.privateGroup
                        ? theme.lightColor
                        : "transparent"
                    }}
                  >
                    <Text
                      style={{ textAlign: "center", color: theme.mainColor }}
                    >
                      Public
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={{ color: theme.mainColor }}>
                    {this.state.privateGroup
                      ? "People cannot join this community freely, they'll need an invitation link."
                      : "Anyone can join, the more the merrier!"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

export default connect(
  state => state,
  {
    getJoinedGroups,
    updateGroup
  }
)(withTheme(EditCommunity));
