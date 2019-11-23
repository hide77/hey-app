import React from "react";
import Lightbox from "react-native-lightbox";
import { CachedImage } from "react-native-cached-image";
import {
  TouchableOpacity,
  Linking,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from "react-native";

const IMAGE = "image";
const LINK = "link";

export default ({ attachment, other, appTheme: theme }) => {
  let content;
  switch (attachment.type) {
    case IMAGE:
      content = (
        <View
          style={{
            marginTop: 0,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderBottomLeftRadius: other ? 4 : 12,
            borderBottomRightRadius: other ? 12 : 4,
            borderColor: theme.chat(!other).bubbleBg,
            overflow: "hidden"
          }}
        >
          <Lightbox
            activeProps={{
              style: {
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height
              },
              resizeMode: "contain"
            }}
            willClose={() => {}}
            springConfig={{
              tension: 900000,
              friction: 900000
            }}
            swipeToDismiss={false}
            renderHeader={close => (
              <TouchableOpacity onPress={close}>
                <Text style={styles.closeButton}> Close </Text>
              </TouchableOpacity>
            )}
            renderContent={() => (
              <ScrollView
                minimumZoomScale={1}
                maximumZoomScale={3}
                centerContent={true}
              >
                <CachedImage
                  source={{
                    uri: attachment.url
                  }}
                  style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height
                  }}
                  resizeMode="contain"
                />
              </ScrollView>
            )}
          >
            <CachedImage
              source={{
                uri: attachment.url
              }}
              style={{
                flex: 1,
                height: 100
              }}
              resizeMode="cover"
            />
          </Lightbox>
        </View>
      );
      break;
    case LINK:
      content = (
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CachedImage
              source={{
                uri: attachment.image
              }}
              style={{
                height: 80,
                width: 80
              }}
            />
          </View>
          <View
            style={{
              flex: 3
            }}
          >
            <Text
              style={{
                fontWeight: "bold"
              }}
            >
              {attachment.title}
            </Text>
            <Text> {attachment.description} </Text>
          </View>
        </View>
      );
      break;
    default:
      content = (
        <View>
          <Text> {attachment.title} </Text>
          <Text> {attachment.description} </Text>
          <Text> {attachment.type} </Text> <Text> {attachment.url} </Text>
          <Text> {attachment.image} </Text>
        </View>
      );
      break;
  }
  return (
    <TouchableOpacity onPress={() => Linking.openURL(attachment.url)}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    padding: 8,
    borderRadius: 3,
    textAlign: "center",
    margin: 30,
    marginTop: 50,
    alignSelf: "flex-end"
  }
});
