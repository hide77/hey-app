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

import {
  getPlaylistsResource,
  createPlaylistResource,
  updatePlaylistResource,
  deletePlaylistResource,
  addToPlaylistResource,
  delFromPlaylistResource
} from "hey-resources/Playlists";

const getPlaylistsRequest = () => ({
  type: GET_PLAYLISTS_REQUEST,
  getPlaylistsLoading: true,
  error: null
});
const getPlaylistsSuccess = ({ playlists }) => ({
  type: GET_PLAYLISTS_SUCCESS,
  playlists,
  getPlaylistsLoading: false,
  error: null
});
const getPlaylistsError = ({ error }) => ({
  type: GET_PLAYLISTS_ERROR,
  getPlaylistsLoading: false,
  error
});

export const getPlaylists = ({ cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const playlistsState = getState().playlists;
    if (playlistsState.getPlaylistsLoading) {
      console.log("loading getPlaylists...");
    } else {
      dispatch(getPlaylistsRequest());
      getPlaylistsResource({ token }).then(r => {
        if (r.result) {
          // create default playlist
          if (r.result.length === 0) {
            console.log("creating playlist");
            dispatch(createPlaylistRequest());
            createPlaylistResource({ token, name: "Favorites" }).then(r => {
              if (r.result) {
                const dispatchData = {
                  playlist: r.result
                };
                console.log("⭐️ createPlaylist", r.result);
                dispatch(createPlaylistSuccess(dispatchData));
                cb(r.result);
              } else {
                cb();
                dispatch(createPlaylistError({ r }));
                console.log("⭐️ ERROR createPlaylist", r);
              }
            });
          }
          // filter dead groups
          for (let e in r.result) {
            r.result[e].items = r.result[e].items.filter(e => {
              return e.item.group !== null;
            });
          }
          console.log("filtered", r.result);
          const dispatchData = {
            playlists: r.result
          };
          console.log("⭐️ getPlaylists", r.result);
          dispatch(getPlaylistsSuccess(dispatchData));
          cb(r.result);
        } else {
          dispatch(getPlaylistsError({ r }));
          console.log("⭐️ ERROR getPlaylists", r);
        }
      });
    }
  };
};

const createPlaylistRequest = () => ({
  type: CREATE_PLAYLIST_REQUEST,
  createPlaylistLoading: true,
  error: null
});
const createPlaylistSuccess = ({ playlist }) => ({
  type: CREATE_PLAYLIST_SUCCESS,
  playlist,
  createPlaylistLoading: false,
  error: null
});
const createPlaylistError = ({ error }) => ({
  type: CREATE_PLAYLIST_ERROR,
  createPlaylistLoading: false,
  error
});

export const createPlaylist = ({ name, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const playlistsState = getState().playlists;
    if (playlistsState.createPlaylistLoading) {
      console.log("loading createPlaylist...");
    } else {
      dispatch(createPlaylistRequest());
      createPlaylistResource({ token, name }).then(r => {
        if (r.result) {
          const dispatchData = {
            playlist: r.result
          };
          console.log("⭐️ createPlaylist", r.result);
          dispatch(createPlaylistSuccess(dispatchData));
          cb(r.result);
        } else {
          dispatch(createPlaylistError({ r }));
          console.log("⭐️ ERROR createPlaylist", r);
        }
      });
    }
  };
};

const addToPlaylistRequest = () => ({
  type: ADD_TO_PLAYLIST_REQUEST,
  addToPlaylistLoading: true,
  error: null
});
const addToPlaylistSuccess = ({ item, type, playlist_id }) => ({
  type: ADD_TO_PLAYLIST_SUCCESS,
  item,
  itemType: type,
  addToPlaylistLoading: false,
  error: null
});
const addToPlaylistError = ({ error }) => ({
  type: ADD_TO_PLAYLIST_ERROR,
  addToPlaylistLoading: false,
  error
});

export const addToPlaylist = ({
  item,
  type,
  playlist_id,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const playlistsState = getState().playlists;
    if (playlistsState.addToPlaylistLoading) {
      console.log("loading addToPlaylist...", playlistsState);
    } else {
      dispatch(addToPlaylistRequest());
      addToPlaylistResource({ token, item, type, playlist_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            item,
            type,
            playlist_id
          };
          console.log("⭐️ addToPlaylist", r.result);
          dispatch(addToPlaylistSuccess(dispatchData));
          cb(r.result);
        } else {
          dispatch(addToPlaylistError({ r }));
          console.log("⭐️ ERROR addToPlaylist", r);
        }
      });
    }
  };
};

const delFromPlaylistRequest = () => ({
  type: DEL_FROM_PLAYLIST_REQUEST,
  delFromPlaylistLoading: true,
  error: null
});
const delFromPlaylistSuccess = ({ item, type, playlist_id }) => ({
  type: DEL_FROM_PLAYLIST_SUCCESS,
  item,
  itemType: type
});
const delFromPlaylistError = ({ error }) => ({
  type: DEL_FROM_PLAYLIST_ERROR,
  delFromPlaylistLoading: false,
  error
});

export const delFromPlaylist = ({
  item,
  type,
  playlist_id,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const playlistsState = getState().playlists;
    if (playlistsState.delFromPlaylistLoading) {
      console.log("loading delFromPlaylist...", playlistsState);
    } else {
      dispatch(delFromPlaylistRequest());
      delFromPlaylistResource({ token, item, type, playlist_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            item,
            type,
            playlist_id
          };
          console.log("⭐️ delFromPlaylist", r.result);
          dispatch(delFromPlaylistSuccess(dispatchData));
          cb(r.result);
        } else {
          dispatch(delFromPlaylistError({ r }));
          console.log("⭐️ ERROR delFromPlaylist", r);
        }
      });
    }
  };
};
