import { combineReducers } from "redux";
import authentication from "hey-redux/reducers/authentication";
import chat from "hey-redux/reducers/chat";
import entries from "hey-redux/reducers/entries";
import followers from "hey-redux/reducers/followers";
import moderation from "hey-redux/reducers/moderation";
import notifications from "hey-redux/reducers/notifications";
import subscriptions from "hey-redux/reducers/subscriptions";
import groups from "hey-redux/reducers/groups";
import playlists from "hey-redux/reducers/playlists";
import user from "hey-redux/reducers/user";
import io from "hey-redux/reducers/io";

const appReducer = combineReducers({
  authentication,
  chat,
  entries,
  followers,
  moderation,
  notifications,
  subscriptions,
  groups,
  playlists,
  io,
  user
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
