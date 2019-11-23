import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import ChannelListElement from "hey-components/ChannelListElement";
import { getData, storeData, removeData } from "hey-mocks/AsyncStore";
import { idx } from "hey-mocks/helper";
import { push } from "hey-screens/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const onPressFn = ({ parentComponent, view, params }) => {
  if (view === "ChannelRoom") {
    push(parentComponent, view, params);
  }
};

let playlistsRefreshing = false;
export default ({
  items,
  unsubscribe,
  token,
  getPlaylists,
  parentComponent,
  goToGroup,
  appTheme: theme
}) => {
  return (
    <FlatList
      style={{
        backgroundColor: theme.appBackground
      }}
      data={items}
      extraData={items}
      keyExtractor={(item, index) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={playlistsRefreshing}
          onRefresh={getPlaylists}
        />
      }
      renderItem={({ item }) => {
        return (
          <View style={styles.rowFront({ theme })}>
            <ChannelListElement
              h1Render={
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      goToGroup(item.item.group._id);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: theme.focusColor
                      }}
                    >
                      {idx(["group", "name"], item.item)}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: theme.mainColor
                    }}
                  >{`/${idx(["item", "name"], item)}`}</Text>
                </View>
              }
              h1={`${item.type === "channel" ? "#" : ""}${item.item.name}`}
              h2={idx(["group", "name"], item.item)}
              h3={item.item ? dayjs(item.item.last_message_at).fromNow() : ""}
              preview={`${idx(
                ["last_chat", "user", "username"],
                item.item
              )}: ${idx(["last_chat", "message"], item.item)}`}
              notCount={item.item.new_chats}
              onPressFn={onPressFn}
              pictures={{
                pictures: idx(["group", "pictures"], item.item),
                username: item.item.group.name
              }}
              picturesPress={() => {
                goToGroup(item.item.group._id);
              }}
              onPressParams={{
                parentComponent,
                view: item.type === "channel" ? "ChannelRoom" : "todo",
                params: {
                  channel: {
                    _id: idx(["_id"], item.item),
                    name: idx(["name"], item.item)
                  },
                  group: {
                    _id: idx(["group", "_id"], item.item),
                    name: idx(["group", "name"], item.item),
                    is_member: true
                  }
                }
              }}
              key={item.id}
              appTheme={theme}
            />
          </View>
        );
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderColor: theme.postBorder
          }}
        />
      )}
    />
  );
};

const styles = {
  rowFront: ({ theme }) => ({
    alignItems: "center",
    backgroundColor: theme.postBackground,
    justifyContent: "center"
  }),
  rowBack: ({ theme }) => ({
    alignItems: "center",
    backgroundColor: theme.headerBackground,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  }),
  touchable: {
    backgroundColor: "#fb5066",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
};
