import { FETCH } from "hey-redux/mocks";

export const getPlaylistsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH("/v1/me/playlists", { token }).then(async r => {
      resolve(r);
    });
  });
};

export const createPlaylistResource = ({ name, token }) => {
  return new Promise(resolve => {
    FETCH("POST /v1/playlists", {
      token,
      json: true,
      stringify: true,
      body: { name }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const updatePlaylistResource = ({ name, token, playlist_id }) => {
  return new Promise(resolve => {
    FETCH(`PATCH /v1/playlists/${playlist_id}`, {
      token,
      json: true,
      data: { name }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const deletePlaylistResource = ({ token, playlist_id }) => {
  return new Promise(resolve => {
    FETCH(`DELETE /v1/playlists/${playlist_id}`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const addToPlaylistResource = ({ type, token, item, playlist_id }) => {
  // type: channel|group|site
  return new Promise(resolve => {
    FETCH(`POST /v1/playlists/${playlist_id}/items`, {
      token,
      json: true,
      stringify: true,
      body: { type, item }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const delFromPlaylistResource = ({ type, token, item, playlist_id }) => {
  // type: channel|group|site
  return new Promise(resolve => {
    FETCH(`DELETE /v1/playlists/${playlist_id}/items`, {
      token,
      json: true,
      stringify: true,
      body: { type, item }
    }).then(async r => {
      resolve(r);
    });
  });
};
