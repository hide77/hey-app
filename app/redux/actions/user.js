import { FETCH, WRONG_TOKEN } from "hey-redux/mocks";
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
  GET_MY_HISTORY_SUCCESS,
  THEME_CHANGED
} from "hey-redux/types/user";
import { logoutUser } from "./authentication";

export const getUser = (username, push) => (dispatch, getState) => {
  FETCH(`/v1/users/search/${username}`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.success) {
      const id = r.result.find(result => result.username === username)._id;
      if (id) push("User", { id });
      dispatch(getMeRequest());
    }
  });
};

const getMeRequest = () => ({
  type: GET_ME_REQUEST,
  isLoading: true
});

const getMeSuccess = result => ({
  type: GET_ME_SUCCESS,
  isLoading: false,
  isAnonymous: false,
  error: "",
  result
});

const getMeFailure = error => ({
  type: GET_ME_FAILURE,
  isLoading: false,
  isAnonymous: true,
  error
});

export const getAuthenticatedUser = (_token = null, _cb = () => {}) => (
  dispatch,
  getState
) => {
  const token = _token ? _token : getState().authentication.token;
  if (!getState().user.isLoading) {
    dispatch(getMeRequest());
    if (!token) {
      dispatch(getMeFailure("user is anonymous"));
      dispatch(logoutUser());
      return;
    } else {
      FETCH(`/v1/me`, {
        dispatch,
        token
      })
        .then(r => {
          if (r.success) {
            console.log("GOD MODE", r.result);
            dispatch(getMeSuccess(r.result));
          } else {
            dispatch(getMeFailure(r.error));
          }
          _cb(r);
        })
        .catch(r => {
          dispatch(logoutUser());
          dispatch(getMeFailure(r.error));
        });
    }
  }
};

const getMyHistorySuccess = history => ({
  type: GET_MY_HISTORY_SUCCESS,
  history
});

export const getMyHistory = () => (dispatch, getState) => {
  const token = getState().authentication.token;
  if (!token) {
    dispatch(getMeFailure("user is anonymous"));
    return;
  }
  FETCH(`/v1/history`, {
    dispatch,
    token
  }).then(r => {
    if (r.success) {
      dispatch(getMyHistorySuccess(r.result));
    }
  });
};

const updateMeSuccess = result => ({
  type: UPDATE_ME_SUCCESS,
  isLoading: false,
  result
});

export const updateMe = (body, _errorMgmt = () => {}) => (
  dispatch,
  getState
) => {
  const token = FETCH(`PATCH /v1/me`, {
    dispatch,
    token: getState().authentication.token,
    json: true,
    body: JSON.stringify(body)
  }).then(r => {
    if (r.success) {
      dispatch(updateMeSuccess(r.result));
    }
    _errorMgmt(!r.success);
  });
};

const changePasswordSuccess = result => ({
  type: CHANGE_PASSWORD_SUCCESS,
  error: ""
});

const changePasswordFailure = error => ({
  type: CHANGE_PASSWORD_FAILURE,
  error
});

export const changePassword = (body, token) => dispatch => {
  if (body.new_password !== body.new_password_confirm) {
    dispatch(differentNewPasswords());
    return;
  }
  FETCH(`POST /v1/password/change`, {
    dispatch,
    token,
    json: true,
    body: JSON.stringify(body)
  }).then(r => {
    if (r.success) dispatch(changePasswordSuccess(r.result));
    else {
      dispatch(changePasswordFailure(r.error));
    }
  });
};

const removeErrors = () => ({
  type: REMOVE_ERRORS
});

const differentNewPasswords = () => ({
  type: DIFFERENT_NEW_PASSWORDS
});

const themeChanged = theme => ({
  type: THEME_CHANGED,
  theme
});

export const changeTheme = theme => dispatch => {
  // setTheme(theme);
  dispatch(themeChanged(theme));
};

const uploadNewProfilePictureSuccess = picture => ({
  type: UPLOAD_NEW_PROFILE_PICTURE,
  picture
});

export const uploadNewProfilePicture = file => (dispatch, getState) => {
  FETCH(`POST /v1/pictures/users`, {
    dispatch,
    token: getState().authentication.token,
    body: file
  }).then(j => {
    if (j.success) {
      dispatch(uploadNewProfilePictureSuccess(j.result));
    }
  });
};

const searchUserSuccess = searchedUsers => ({
  type: SEARCH_USER_SUCCESS,
  searchedUsers
});

export const searchUser = (username, cb = () => {}) => (dispatch, getState) => {
  if (username[0] === "@") {
    username = username.slice(1);
  }
  const token = getState().authentication.token;
  FETCH(`/v1/users/search/${username}`, {
    dispatch,
    token: getState().authentication.token,
    params: {
      limit: 10,
      offset: 0
    }
  }).then(r => {
    console.log("result", r, username);
    if (r.success) {
      dispatch(searchUserSuccess(r.result));
      cb(r.result);
    }
  });
};
