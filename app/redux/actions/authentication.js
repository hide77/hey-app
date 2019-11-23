import { storeData, removeData } from "hey-mocks/AsyncStore";
import { FETCH } from "hey-redux/mocks";
import {
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
  RESET_PASSWORD_SUCCESS
} from "hey-redux/types/authentication";
import { goToAuth, goHome, goInit } from "hey-screens/navigation";
import { getSiteId } from "hey-redux/actions/entries";
import { getAuthenticatedUser } from "hey-redux/actions/user";
import { getSubscriptions } from "hey-redux/actions/subscriptions";

const setTokenSuccess = token => ({
  type: SET_TOKEN_SUCCESS,
  token
});
export const setToken = token => dispatch => {
  dispatch(setTokenSuccess(token));
};

const readStorage = token => ({
  type: READ_STORAGE,
  isAuthenticated: true,
  token
});

const loginRequest = () => ({
  type: LOGIN_REQUEST,
  isLoading: true,
  error: null
});

const loginSuccess = ({ token, refresh_token }) => ({
  type: LOGIN_SUCCESS,
  isLoading: false,
  isAuthenticated: true,
  token,
  refresh_token,
  error: null,
  loggedOut: false
});

const loginFailure = error => ({
  type: LOGIN_FAILURE,
  isLoading: false,
  isAuthenticated: false,
  error
});

export const loginUser = (body = {}) => (dispatch, getState) => {
  dispatch(loginRequest());

  FETCH("POST /v1/auth/generate", {
    dispatch,
    json: true,
    body: JSON.stringify(body)
  }).then(async r => {
    if (r.success) {
      dispatch(loginSuccess(r.result));
      try {
        await storeData("token", r.result, { json: true });
      } catch (error) {
        dispatch(loginFailure(error));
        dispatch(resetErrors());
      }
      goInit();
    } else {
      dispatch(loginFailure(r.error));
      dispatch(resetErrors());
    }
  });
};

const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
  isAuthenticated: false,
  token: "",
  loggedOut: true
});

export const logoutUser = ({ _refresh = false } = {}) => (
  dispatch,
  getState
) => {
  const refresh_token = getState().authentication.refresh_token;
  if (_refresh && refresh_token) {
    // TO DO, waiting for backend
  } else {
    removeData("token", () => dispatch(logoutSuccess()));
    dispatch(logoutSuccess());
    goToAuth();
  }
};

const registerRequest = () => ({ type: REGISTER_REQUEST, isLoading: true });

const registerSuccess = () => ({
  type: REGISTER_SUCCESS,
  isLoading: false
});

const registerFailure = error => ({
  type: REGISTER_FAILURE,
  isLoading: false,
  error
});

export const registerUser = body => dispatch => {
  dispatch(registerRequest());

  FETCH("POST /v1/users", {
    dispatch,
    json: true,
    body: JSON.stringify(body)
  }).then(r => {
    if (r.success && r.result) {
      dispatch(registerSuccess());
      dispatch(loginUser(body));
    } else {
      const errorMessage = (r.error.email && r.error.email.message) || r.error;
      dispatch(
        registerFailure(
          typeof errorMessage === "string"
            ? errorMessage.replace("_", " ")
            : "Unknown error"
        )
      );
      dispatch(resetErrors());
    }
  });
};

const resetPasswordSuccess = forgotStatus => ({
  type: RESET_PASSWORD_SUCCESS,
  forgotStatus
});

export const resetPassword = body => dispatch => {
  FETCH("POST /v1/password/reset", {
    dispatch,
    json: true,
    body: JSON.stringify(body)
  }).then(r => {
    if (r.success) dispatch(resetPasswordSuccess(r.result));
  });
};

const resetErrorsSuccess = () => ({ type: RESET_ERRORS });

export const resetErrors = () => dispatch => {
  dispatch(resetErrorsSuccess());
};
