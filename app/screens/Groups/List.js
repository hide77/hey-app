import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChannelListElement from "hey-components/ChannelListElement";
import { getData, storeData, removeData } from "hey-mocks/AsyncStore";
import { idx } from "hey-mocks/helper";
import { push } from "hey-screens/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const onPressFn = ({ parentComponent, view, params }) => {
  push(parentComponent, view, params);
};

export default ({
  channels,
  group,
  unsubscribe,
  token,
  parentComponent,
  appTheme: theme
}) => {
  return (
    <FlatList
      style={{
        backgroundColor: theme.appBackground
      }}
      data={channels}
      extraData={channels}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => {
        return (
          <View style={styles.rowFront({ theme })}>
            <ChannelListElement
              h1={`${item.private ? "" : "#"}${item.name}`}
              h1Icon={item.private ? "md-lock" : null}
              h2={idx(
                ["user", "username"],
                item.last_chat,
                `Created ${dayjs(item.created_at).fromNow()}`
              )}
              h3={
                item.last_chat
                  ? dayjs(item.last_chat.created_at).fromNow()
                  : `${dayjs(item.created_at).fromNow()}`
              }
              preview={idx(["message"], item.last_chat, "Nothing in here yet")}
              notCount={item.new_chats}
              onPressFn={onPressFn}
              onPressParams={{
                parentComponent,
                view: "ChannelRoom",
                params: {
                  channel: item,
                  group
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
