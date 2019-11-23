import { FETCH } from "hey-redux/mocks";

import {
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_SUCCESS,
  GET_MY_FOLLOWERS_SUCCESS,
  GET_MY_FOLLOWINGS_SUCCESS
} from "hey-redux/types/followers";

const followUserSuccess = following => ({
  type: FOLLOW_USER_SUCCESS,
  following
});

const unfollowUserSuccess = () => ({
  type: UNFOLLOW_USER_SUCCESS
});

export const followUser = userId => (dispatch, getState) => {
  FETCH(`POST /v1/users/${userId}/follow`, {
    dispatch,
    token: getState().authentication.token
  }).then(j => {
    if (r.success) {
      if (r.result) dispatch(followUserSuccess(r.result.following));
      else dispatch(unfollowUserSuccess());
    }
  });
};

const getMyFollowersSuccess = followers => ({
  type: GET_MY_FOLLOWERS_SUCCESS,
  followers
});

export const getMyFollowers = token => dispatch => {
  FETCH(`/v1/followers`, {
    dispatch,
    token
  }).then(r => {
    dispatch(getMyFollowersSuccess(r.result.length));
  });
};

const getMyFollowingsSuccess = followings => ({
  type: GET_MY_FOLLOWINGS_SUCCESS,
  followings
});

export const getMyFollowings = token => dispatch => {
  FETCH(`/v1/followings`, {
    dispatch,
    token
  }).then(r => {
    dispatch(getMyFollowingsSuccess(r.result.length));
  });
};

export const getUserFollowers = (userId, token) => dispatch => {
  FETCH(`/v1/users/${userId}/followers`, {
    dispatch,
    token
  }).then(r => {
    dispatch();
  });
};

export const getUserFollowings = (userId, token) => dispatch => {
  FETCH(`/v1/users/${userId}/followings`, {
    dispatch,
    token
  }).then(r => {
    dispatch();
  });
};
