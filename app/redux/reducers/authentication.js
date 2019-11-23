import {
  FACEBOOK_TOKEN_SUCCESS,
  GITHUB_TOKEN_SUCCESS,
  GOOGLE_TOKEN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  READ_STORAGE,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  RESET_ERRORS,
  SET_TOKEN_SUCCESS,
} from 'hey-redux/types/authentication';

const defaultState = {
  isLoading: false,
  isAuthenticated: false,
  token: '',
  refresh_token: '',
  errorMessage: false,
  loggedOut: false,
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_TOKEN_SUCCESS:
      return Object.assign({}, state, {token: action.token});
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, action);
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        error: action.error,
        errorMessage: true,
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, action);
    case GOOGLE_TOKEN_SUCCESS:
      return Object.assign({}, state, action);
    case FACEBOOK_TOKEN_SUCCESS:
      return Object.assign({}, state, action);
    case GITHUB_TOKEN_SUCCESS:
      return Object.assign({}, state, action);
    case READ_STORAGE:
      return Object.assign({}, state, action);
    case REGISTER_REQUEST:
      return Object.assign({}, state, action);
    case REGISTER_SUCCESS:
      return Object.assign({}, state, action);
    case REGISTER_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        error: action.error,
        errorMessage: true,
      });
    case RESET_ERRORS:
      return Object.assign({}, state, {
        ...action,
        errorMessage: false,
      });
    default:
      return state;
  }
};
