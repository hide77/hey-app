import { FETCH } from "hey-redux/mocks";
import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
  GET_COUNT_UNREAD_PM_NOTIFICATIONS_SUCCESS,
  SET_READ_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_SUCCESS
} from "hey-redux/types/notifications";
import { logoutUser } from "./authentication";

const getNotificationsSuccess = ({ notifications, reset }) => ({
  type: GET_NOTIFICATIONS_SUCCESS,
  notifications,
  loading: false,
  hasMore: reset ? true : notifications.length > 0,
  reset
});
const getNotificationsRequest = ({ newOffset }) => ({
  type: GET_NOTIFICATIONS_REQUEST,
  loading: true,
  offset: newOffset,
  error: null
});
export const getNotifications = ({
  reset = false,
  log = "",
  cb = () => {}
} = {}) => (dispatch, getState) => {
  const token = getState().authentication.token;
  const notificationState = getState().notifications;
  const newOffset = reset
    ? 0
    : notificationState.offset + notificationState.limit;
  if (notificationState.loading) {
    // console.log("loading...", log);
  } else {
    dispatch(getNotificationsRequest({ newOffset }));
    FETCH("/v1/notifications", {
      dispatch,
      token,
      params: {
        limit: notificationState.limit,
        offset: newOffset
      }
    }).then(r => {
      if (r.success) {
        cb();
        dispatch(getNotificationsSuccess({ notifications: r.result, reset }));
      }
    });
  }
};

const getCountUnreadSuccess = unreadCount => ({
  type: GET_COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
  unreadCount
});

export const getCountUnread = _unreadCount => (dispatch, getState) => {
  if (_unreadCount) {
    dispatch(getCountUnreadSuccess(_unreadCount));
  } else {
    FETCH("/v1/notifications/count", {
      dispatch,
      token: getState().authentication.token
    }).then(r => {
      dispatch(getCountUnreadSuccess(r.result));
    });
  }
};

const getCountUnreadPMSuccess = unreadCount => ({
  type: GET_COUNT_UNREAD_PM_NOTIFICATIONS_SUCCESS,
  unreadCountPM: unreadCount
});

export const getCountUnreadPM = _unreadCount => (dispatch, getState) => {
  if (_unreadCount) {
    dispatch(getCountUnreadPMSuccess(_unreadCount));
  } else {
    FETCH("/v1/chats/private/count", {
      dispatch,
      token: getState().authentication.token
    }).then(r => {
      dispatch(getCountUnreadPMSuccess(r.result));
    });
  }
};

const setReadNotificationSuccess = () => ({
  type: SET_READ_NOTIFICATION_SUCCESS
});

export const setReadNotification = notifId => (dispatch, getState) => {
  FETCH(`POST /v1/notifications/${notifId}/read`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    dispatch(setReadNotificationSuccess());
  });
};

const deleteNotificationSuccess = () => ({
  type: DELETE_NOTIFICATION_SUCCESS
});

export const deleteNotification = (notifId, token) => dispatch => {
  FETCH(`DELETE /v1/notifications/${notifId}/read`, {
    dispatch,
    token
  }).then(r => {
    dispatch(deleteNotificationSuccess());
  });
};
