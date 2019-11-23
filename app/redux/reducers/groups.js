import {
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_ERROR,
  UPDATE_GROUP_REQUEST,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_ERROR,
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_ERROR,
  GET_CURRENT_GROUP_REQUEST,
  GET_CURRENT_GROUP_SUCCESS,
  GET_CURRENT_GROUP_ERROR,
  GET_JOINED_GROUPS_REQUEST,
  GET_JOINED_GROUPS_SUCCESS,
  GET_JOINED_GROUPS_ERROR,
  SET_CURRENT_CHANNEL,
  DELETE_GROUP_REQUEST,
  DELETE_GROUP_SUCCESS,
  DELETE_GROUP_ERROR,
  ADD_CHANNEL_TO_GROUP_REQUEST,
  ADD_CHANNEL_TO_GROUP_SUCCESS,
  ADD_CHANNEL_TO_GROUP_ERROR,
  REMOVE_CHANNEL_FROM_GROUP_REQUEST,
  REMOVE_CHANNEL_FROM_GROUP_SUCCESS,
  REMOVE_CHANNEL_FROM_GROUP_ERROR,
  UPDATE_CHANNEL_REQUEST,
  UPDATE_CHANNEL_SUCCESS,
  UPDATE_CHANNEL_ERROR,
  LEAVE_GROUP_REQUEST,
  LEAVE_GROUP_SUCCESS,
  LEAVE_GROUP_ERROR,
  GENERATE_SHARE_TOKEN_REQUEST,
  GENERATE_SHARE_TOKEN_SUCCESS,
  GENERATE_SHARE_TOKEN_ERROR,
  DESTROY_SHARE_TOKEN_REQUEST,
  DESTROY_SHARE_TOKEN_SUCCESS,
  DESTROY_SHARE_TOKEN_ERROR,
  JOIN_GROUP_REQUEST,
  JOIN_GROUP_SUCCESS,
  JOIN_GROUP_ERROR,
  JOIN_GROUP_W_TOKEN_REQUEST,
  JOIN_GROUP_W_TOKEN_SUCCESS,
  JOIN_GROUP_W_TOKEN_ERROR,
  SET_SHARE_TOKEN_REQUEST,
  SET_SHARE_TOKEN_SUCCESS,
  SET_SHARE_TOKEN_ERROR
} from "hey-redux/types/groups";

import { stateDelete, stateUpdate, isKeyinArray } from "hey-redux/mocks";

const defaultState = {
  createGroupLoading: false,
  updateGroupLoading: false,
  getGroupsLoading: false,
  getJoinedGroupsLoading: false,
  deleteGroupLoading: false,
  joinGroupLoading: false,
  joinGroupWTokenLoading: false,
  leaveGroupLoading: false,
  updateChannelLoading: false,
  generateShareTokenLoading: false,
  setShareTokenLoading: false,
  destroyShareTokenLoading: false,
  groups: [],
  addChannelToGroupLoading: false,
  removeChannelFromGroupLoading: false,
  joinedGroups: [],
  currentGroup: {},
  currentChannel: null
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return Object.assign({}, state, action);
    case CREATE_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case CREATE_GROUP_SUCCESS:
      return Object.assign({}, state, {
        createGroupLoading: false,
        joinedGroups: [action.group, ...state.joinedGroups],
        currentGroup: action.group
      });
    case UPDATE_GROUP_SUCCESS:
      let _updateJoinedGroups = stateDelete(
        state.joinedGroups,
        "_id",
        action.group._id
      );
      _updateJoinedGroups.unshift(action.group);
      console.log("home updated", _updateJoinedGroups);
      return Object.assign({}, state, {
        updateGroupLoading: false,
        joinedGroups: _updateJoinedGroups,
        currentGroup: action.group
      });
    case CREATE_GROUP_ERROR:
      return Object.assign({}, state, action);
    case GET_GROUPS_REQUEST:
      return Object.assign({}, state, action);
    case GET_GROUPS_SUCCESS:
      return Object.assign({}, state, action);
    case GET_GROUPS_ERROR:
      return Object.assign({}, state, action);
    case GET_CURRENT_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case GET_CURRENT_GROUP_SUCCESS:
      return Object.assign({}, state, action);
    case GET_CURRENT_GROUP_ERROR:
      return Object.assign({}, state, action);
    case GET_JOINED_GROUPS_REQUEST:
      return Object.assign({}, state, action);
    case GET_JOINED_GROUPS_SUCCESS:
      return Object.assign({}, state, action);
    case GET_JOINED_GROUPS_ERROR:
      return Object.assign({}, state, action);
    case DELETE_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case DELETE_GROUP_SUCCESS:
      return Object.assign({}, state, {
        deleteGroupLoading: false,
        error: false,
        joinedGroups: stateDelete(state.joinedGroups, "_id", action.group_id)
      });
    case DELETE_GROUP_ERROR:
      return Object.assign({}, state, action);
    case LEAVE_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case LEAVE_GROUP_SUCCESS:
      return Object.assign({}, state, {
        leaveGroupLoading: false,
        error: false,
        joinedGroups: stateDelete(state.joinedGroups, "_id", action.group_id)
      });
    case LEAVE_GROUP_ERROR:
      return Object.assign({}, state, action);
    case ADD_CHANNEL_TO_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case ADD_CHANNEL_TO_GROUP_SUCCESS:
      return Object.assign({}, state, {
        addChannelToGroupLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          channels: [action.channel, ...state.currentGroup.channels]
        }
      });
    case ADD_CHANNEL_TO_GROUP_ERROR:
      return Object.assign({}, state, action);
    case UPDATE_CHANNEL_REQUEST:
      return Object.assign({}, state, action);
    case UPDATE_CHANNEL_SUCCESS:
      return Object.assign({}, state, {
        updateChannelLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          channels: stateUpdate(
            state.currentGroup.channels,
            "_id",
            action.channel
          )
        }
      });
    case UPDATE_CHANNEL_ERROR:
      return Object.assign({}, state, action);
    case JOIN_GROUP_SUCCESS:
      if (
        action.group &&
        action.group.id &&
        !isKeyinArray("id", action.group.id, state.joinedGroups)
      )
        return Object.assign({}, state, {
          joinGroupLoading: false,
          error: false,
          joinedGroups: [action.group, ...state.joinedGroups]
        });
      else {
        return Object.assign({}, state, action);
      }
    case JOIN_GROUP_W_TOKEN_SUCCESS:
      if (
        action.group &&
        action.group.id &&
        !isKeyinArray("_id", action.group.id, state.joinedGroups)
      )
        return Object.assign({}, state, {
          joinGroupLoading: false,
          error: false,
          joinedGroups: [action.group, ...state.joinedGroups]
        });
      else {
        return Object.assign({}, state, action);
      }
    case REMOVE_CHANNEL_FROM_GROUP_REQUEST:
      return Object.assign({}, state, action);
    case REMOVE_CHANNEL_FROM_GROUP_SUCCESS:
      return Object.assign({}, state, {
        removeChannelFromGroupLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          channels: stateDelete(
            state.currentGroup.channels,
            "_id",
            action.channel_id
          )
        }
      });
    case REMOVE_CHANNEL_FROM_GROUP_ERROR:
      return Object.assign({}, state, action);
    case GENERATE_SHARE_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        generateShareTokenLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          token: action.shareToken
        }
      });
    case SET_SHARE_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        setShareTokenLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          token: action.tokenName
        }
      });
    case DESTROY_SHARE_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        generateShareTokenLoading: false,
        error: false,
        currentGroup: {
          ...state.currentGroup,
          token: null
        }
      });
    default:
      return state;
  }
};
