import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
  GET_COUNT_UNREAD_PM_NOTIFICATIONS_SUCCESS,
  SET_READ_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_SUCCESS
} from "hey-redux/types/notifications";
import _ from "lodash";

const defaultState = {
  unreadCount: 0,
  loading: false,
  error: false,
  hasMore: true,
  offset: 0,
  limit: 20,
  notifications: []
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        ...action,
        notifications: action.reset
          ? action.notifications
          : _.flatten([state.notifications, action.notifications]),
        hasMore: action.hasMore,
        loading: false
      });
    case GET_NOTIFICATIONS_REQUEST:
      return Object.assign({}, state, action);
    case GET_COUNT_UNREAD_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, action);
    case GET_COUNT_UNREAD_PM_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, action);
    case SET_READ_NOTIFICATION_SUCCESS:
      return Object.assign({}, state, action);
    case DELETE_NOTIFICATION_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
