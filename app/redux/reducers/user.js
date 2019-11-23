import {
  GET_ME_REQUEST,
  GET_ME_SUCCESS,
  SEARCH_USER_SUCCESS,
  GET_ME_FAILURE,
  UPDATE_ME_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  REMOVE_ERRORS,
  DIFFERENT_NEW_PASSWORDS,
  UPLOAD_NEW_PROFILE_PICTURE,
  THEME_CHANGED,
  GET_MY_HISTORY_SUCCESS,
} from 'hey-redux/types/user';

const defaultState = {
  isLoading: false,
  result: null,
  isAnonymous: false,
  error: '',
  theme: 'ide',
  hoveredUser: {karma: '-', nb_followings: '-', nb_followers: '-'},
  searchedUsers: [],
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_MY_HISTORY_SUCCESS:
      return Object.assign({}, state, action);
    case GET_ME_REQUEST:
      return Object.assign({}, state, action);
    case GET_ME_SUCCESS:
      return Object.assign({}, state, action);
    case GET_ME_FAILURE:
      return Object.assign({}, state, action);
    case UPDATE_ME_SUCCESS:
      return Object.assign({}, state, action);
    case CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, {error: ''});
    case CHANGE_PASSWORD_FAILURE:
      return Object.assign({}, state, action);
    case REMOVE_ERRORS:
      return Object.assign({}, state, {error: ''});
    case DIFFERENT_NEW_PASSWORDS:
      return Object.assign({}, state, {error: "New passwords don't match"});
    case THEME_CHANGED:
      return Object.assign({}, state, action);
    case SEARCH_USER_SUCCESS:
      return Object.assign({}, state, action);
    case UPLOAD_NEW_PROFILE_PICTURE:
      const newState = {...state};
      newState.result.pictures = {default: action.picture};
      return Object.assign({}, state, newState);
    default:
      return state;
  }
};
