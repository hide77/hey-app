import {
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_SUCCESS,
  GET_MY_FOLLOWERS_SUCCESS,
  GET_MY_FOLLOWINGS_SUCCESS,
} from 'hey-redux/types/followers';

const defaultState = {followings: 0, followers: 0};
export default (state = defaultState, action) => {
  switch (action.type) {
    case FOLLOW_USER_SUCCESS:
      return Object.assign({}, state, action);
    case UNFOLLOW_USER_SUCCESS:
      return Object.assign({}, state, action);
    case GET_MY_FOLLOWERS_SUCCESS:
      return Object.assign({}, state, action);
    case GET_MY_FOLLOWINGS_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
