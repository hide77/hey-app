import {
  GET_PLAYLISTS_REQUEST,
  GET_PLAYLISTS_SUCCESS,
  GET_PLAYLISTS_ERROR,
  CREATE_PLAYLIST_REQUEST,
  CREATE_PLAYLIST_SUCCESS,
  CREATE_PLAYLIST_ERROR,
  UPDATE_PLAYLIST_REQUEST,
  UPDATE_PLAYLIST_SUCCESS,
  UPDATE_PLAYLIST_ERROR,
  DELETE_PLAYLIST_REQUEST,
  DELETE_PLAYLIST_SUCCESS,
  DELETE_PLAYLIST_ERROR,
  ADD_TO_PLAYLIST_REQUEST,
  ADD_TO_PLAYLIST_SUCCESS,
  ADD_TO_PLAYLIST_ERROR,
  DEL_FROM_PLAYLIST_REQUEST,
  DEL_FROM_PLAYLIST_SUCCESS,
  DEL_FROM_PLAYLIST_ERROR
} from "hey-redux/types/playlists";

import { stateDelete } from "hey-redux/mocks";

const defaultState = {
  playlists: [],
  channelInPlaylists: [],
  getPlaylistsLoading: false,
  createPlaylistLoading: false,
  updatePlaylistLoading: false,
  deletePlaylistLoading: false,
  addToPlaylistLoading: false,
  delFromPlaylistLoading: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_PLAYLISTS_REQUEST:
      return Object.assign({}, state, action);
    case GET_PLAYLISTS_SUCCESS:
      let channelInPlaylists = [];
      for (let e in action.playlists) {
        for (let f in action.playlists[e].items) {
          channelInPlaylists.push(action.playlists[e].items[f].item._id);
        }
      }
      return Object.assign({}, state, { ...action, channelInPlaylists });
    case GET_PLAYLISTS_ERROR:
      return Object.assign({}, state, action);
    case CREATE_PLAYLIST_REQUEST:
      return Object.assign({}, state, action);
    case CREATE_PLAYLIST_SUCCESS:
      return Object.assign({}, state, {
        createPlaylistLoading: false,
        playlists: [action.playlist, ...state.playlists]
      });
    case CREATE_PLAYLIST_ERROR:
      return Object.assign({}, state, action);
    case UPDATE_PLAYLIST_REQUEST:
      return Object.assign({}, state, action);
    case UPDATE_PLAYLIST_SUCCESS:
      return Object.assign({}, state, action);
    case UPDATE_PLAYLIST_ERROR:
      return Object.assign({}, state, action);
    case DELETE_PLAYLIST_REQUEST:
      return Object.assign({}, state, action);
    case DELETE_PLAYLIST_SUCCESS:
      return Object.assign({}, state, action);
    case DELETE_PLAYLIST_ERROR:
      return Object.assign({}, state, action);
    case ADD_TO_PLAYLIST_REQUEST:
      return Object.assign({}, state, action);
    case ADD_TO_PLAYLIST_SUCCESS:
      return Object.assign({}, state, {
        channelInPlaylists: [action.item, ...state.channelInPlaylists],
        addToPlaylistLoading: false,
        error: null
      });
    case ADD_TO_PLAYLIST_ERROR:
      return Object.assign({}, state, action);
    case DEL_FROM_PLAYLIST_REQUEST:
      return Object.assign({}, state, action);
    case DEL_FROM_PLAYLIST_SUCCESS:
      let newObj = stateDelete(
        state.channelInPlaylists,
        null,
        action.item
      );
      return Object.assign({}, state, {
        delFromPlaylistLoading: false,
        error: null,
        channelInPlaylists: newObj
      });
    case DEL_FROM_PLAYLIST_ERROR:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
