import React from "react";
import MentionsTextInput from "react-native-mentions";
import { searchUser } from "hey-redux/actions/user";
import {
  Image,
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import UserPicture from "hey-components/UserPicture";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DEFAULT_API_URL } from "hey-mocks";
import { getData, storeData, removeData } from "hey-mocks/AsyncStore";
import { appendMessage } from "hey-redux/actions/chat";
import { JoinButton, Container, Input, Shadow } from "hey-components/Common";
import getColorFromString from "hey-mocks/getColorFromString";
import _ from "lodash";
import { withTheme } from "hey-theme";
import I18n from "hey-i18n";

class Footer extends React.Component {
  state = {
    message: "",
    justSubscribed: false,
    imageUri: null,
    dismissPhotoTimeout: null,
    keyword: "",
    data: [],
    tags: []
  };

  componentDidMount() {
    getData(`DRAFT:${this.props.roomId}`).then(draft => {
      if (draft) {
        this.setState({ message: draft });
      }
    });
  }

  dismissPhoto = () => {
    this.setState({
      dismissPhotoTimeout: setTimeout(() => {
        this.setState({ dismissPhotoTimeout: null });
      }, 2000)
    });
  };

  dismissPhotoConfirmation = () => {
    this.setState({ imageUri: null });
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
          Authorization: `Bearer ${this.props.token}`
        },
        body: data
      })
        .then(j => j.json())
        .then(r => {
          if (r.success) {
            this.setState({
              imageUri: `https://${r.result}`
            });
          }
        });
    }
  };

  renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity
        onPress={() => this.onSuggestionTap(item, hidePanel)}
        style={[
          styles.wrapper(global.theme),
          { width: Dimensions.get("window").width }
        ]}
      >
        <View style={styles.center}>
          <UserPicture
            size={16}
            superStyle={{
              marginRight: 9,
              marginLeft: 9
            }}
            user={item}
          />
        </View>
        <View style={[{ flex: 1 }]}>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 2,
              flex: 1
            }}
          >
            <Text style={styles.notificationText(global.theme)}>
              {item.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onSuggestionTap(user, hidePanel) {
    hidePanel();
    const comment = this.state.message.slice(0, -this.state.keyword.length);
    this.setState({
      data: [],
      tags: [...this.state.tags, user._id],
      message: comment + "@" + user.username
    });
  }

  callback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }

    this.reqTimer = setTimeout(() => {
      this.props.searchUser(keyword, data => {
        this.setState({
          keyword: keyword,
          data: [...data]
        });
      });
    }, 200);
  }

  submitChat = () => {
    this.props.submitChat(
      {
        message: this.state.message,
        imageUri: this.state.imageUri,
        tags: this.state.tags
      },
      () => {
        this.setState({ message: "", tags: [], imageUri: "" });
        removeData(`DRAFT:${this.props.roomId}`);
        this.dismissPhotoConfirmation();
      }
    );
  };

  render() {
    const { width, height } = Dimensions.get("window");
    const { theme } = this.props;
    const fTheme = theme.chatRoom.footer;
    if (
      !this.props.private &&
      !this.props.subscribed &&
      !this.state.justSubscribed
    ) {
      return (
        <Shadow style={{ width: "100%" }}>
          <Container
            row
            style={{
              backgroundColor: fTheme.backgroundColor,
              width: "100%",
              justifyContent: "center",
              padding: 10
            }}
          >
            <TouchableOpacity
              style={{ minWidth: "60%" }}
              onPress={() => {
                this.props.subscribe();
                this.setState({ justSubscribed: true });
              }}
            >
              <Text
                style={{
                  margin: 10,
                  textAlign: "center",
                  color: theme.mainColor
                }}
              >
                {I18n.t("ChatRoom.youAreViewing")}
                <Text style={{ fontWeight: "bold" }}>
                  {` ${this.props.roomName}`}
                </Text>
              </Text>
              <JoinButton
                style={{ marginBottom: 10 }}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.75, y: 1.0 }}
                locations={[0, 1]}
                colors={["#4FCFD7", "#257CF3"]}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  Join chat
                </Text>
              </JoinButton>
            </TouchableOpacity>
          </Container>
        </Shadow>
      );
    }
    return (
      <View
        style={{
          width: "100%",
          // shadowOpacity: 0.14,
          // shadowRadius: 7,
          // shadowColor: "#1c2ba3",
          // shadowOffset: { height: 0, width: 0 },
          // elevation: 5,
          backgroundColor: fTheme.backgroundColor,
          borderTopWidth: 1,
          borderColor: fTheme.topBorder
        }}
      >
        {this.props.openedMessage && (
          <View
            style={{
              backgroundColor: fTheme.backgroundColor,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 15
            }}
          >
            <Ionicons
              name="ios-undo"
              size={20}
              style={{
                color: fTheme.icons,
                alignSelf: "center",
                height: 20,
                width: 20,
                textAlign: "center"
              }}
            />
            {this.props.openedMessage &&
              this.props.openedMessage.attachements &&
              this.props.openedMessage.attachements.length > 0 && (
                <Image
                  source={{
                    uri:
                      this.props.openedMessage.attachements[0].image ||
                      this.props.openedMessage.attachements[0].url
                  }}
                  style={{ width: 32, height: 32, marginLeft: 10 }}
                />
              )}
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text
                style={{
                  color: fTheme.replyTo,
                  fontWeight: "bold"
                }}
              >
                {`Reply to ${this.props.openedMessage.user.username}`}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: fTheme.replyPreview }}
              >
                {this.props.openedMessage.message}
              </Text>
            </View>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={this.props.closeReply}
            >
              <Ionicons
                name="ios-close"
                size={24}
                style={{ color: fTheme.icons }}
              />
            </TouchableOpacity>
          </View>
        )}
        <Container
          row
          style={{
            backgroundColor: fTheme.backgroundColor,
            width: "100%"
          }}
        >
          {!this.props.private &&
            (this.state.imageUri ? (
              this.state.dismissPhotoTimeout ? (
                <TouchableOpacity
                  style={{
                    width: 32,
                    height: 32,
                    marginHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                  onPress={this.dismissPhotoConfirmation}
                >
                  <Ionicons
                    name="md-trash"
                    size={20}
                    style={{
                      color: theme.dangerColor
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={this.dismissPhoto}>
                  <Image
                    source={{
                      uri: this.state.imageUri
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      marginHorizontal: 10,
                      borderRadius: 4
                    }}
                  />
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                onPress={this.handleChoosePhoto}
                style={{
                  width: 40,
                  height: 52,
                  // paddingHorizontal: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <Ionicons
                  name="md-images"
                  size={20}
                  style={{
                    color: this.state.imageUri ? theme.focusColor : fTheme.icons
                  }}
                />
              </TouchableOpacity>
            ))}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              overflow: "hidden"
            }}
          >
            {/*<Input
              appTheme={theme}
              placeholder={I18n.t("ChatRoom.inputPlaceholder")}
              placeholderTextColor={fTheme.placeholder}
              onChangeText={message => {
                this.setState({ message });
                storeData(`DRAFT:${this.props.roomId}`, message);
              }}
              value={this.state.message}
              style={{
                flex: 1,
                margin: 0,
                color: fTheme.input,
                backgroundColor: fTheme.backgroundColor
              }}
              ref={input => {
                this.props.InitChatRoomInput(input);
              }}
              maxHeight={height * 0.4}
              multiline
              message
            />*/}
            <MentionsTextInput
              placeholderTextColor={fTheme.placeholder}
              textInputStyle={{
                padding: 5,
                fontSize: 15,
                margin: 0,
                color: fTheme.input,
                backgroundColor: fTheme.backgroundColor
              }}
              suggestionsPanelStyle={{}}
              loadingComponent={() => (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
              textInputMinHeight={30}
              textInputMaxHeight={80}
              trigger={"@"}
              triggerLocation={"anywhere"} // 'new-word-only', 'anywhere'
              value={this.state.message}
              onChangeText={val => {
                this.setState({ message: val });
                // storeData(`DRAFT:${this.props.roomId}`, message);
              }}
              triggerCallback={this.callback.bind(this)}
              renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
              suggestionsData={this.state.data} // array of objects
              keyExtractor={(item, index) => item.username}
              suggestionRowHeight={45}
              horizontal={false} // defaut is true, change the orientation of the list
              MaxVisibleRowCount={5} // this is required if horizontal={false}
            />
          </View>
          <TouchableOpacity onPress={this.submitChat}>
            <Text
              style={{
                color: theme.focusColor,
                fontWeight: "bold",
                paddingVertical: 20,
                paddingHorizontal: 16
              }}
            >
              SEND
            </Text>
          </TouchableOpacity>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: theme => ({
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    flexDirection: "row",
    flex: 1
  }),
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  notificationText: theme => ({
    color: theme.mainColor,
    flexWrap: "wrap",
    overflow: "hidden"
  }),
  notificationInfo: theme => ({
    color: theme.lightColor,
    flexWrap: "wrap",
    overflow: "hidden"
  }),
  roomLink: theme => ({
    color: theme.focusColor,
    flexWrap: "wrap",
    overflow: "hidden"
  }),
  chatMessage: ({ theme }) => ({
    backgroundColor: fTheme.backgroundColor
  }),
  container: {
    height: 300,
    justifyContent: "flex-end",
    paddingTop: 100
  },
  suggestionsRowContainer: {
    flexDirection: "row"
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#54c19c"
  },
  usernameInitials: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 15
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: "500"
  },
  usernameText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)"
  }
});

export default connect(
  state => state,
  { searchUser }
)(withTheme(Footer));
