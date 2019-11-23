import { FETCH } from "hey-redux/mocks";
import {
  UPDATE_SUBSCRIPTION,
  SUBSCRIBE_SUCCESS,
  GET_SUBSCRIPTIONS_SUCCESS,
  GET_SUBSCRIPTIONS_REQUEST,
  GET_TRENDING_FROM_NETWORK_SUCCESS
} from "hey-redux/types/subscriptions";
import { getData, storeData } from "hey-mocks/AsyncStore";

const updateSubscriptionsSuccess = (message_id, user_id, site_id) => ({
  type: UPDATE_SUBSCRIPTION,
  message_id,
  user_id,
  site_id
});
export const updateSubscriptions = message => (dispatch, getState) => {
  dispatch(
    updateSubscriptionsSuccess(message._id, message.user.id, message.site._id)
  );
};
// ███████╗██╗   ██╗██████╗ ███████╗
// ██╔════╝██║   ██║██╔══██╗██╔════╝
// ███████╗██║   ██║██████╔╝███████╗
// ╚════██║██║   ██║██╔══██╗╚════██║
// ███████║╚██████╔╝██████╔╝███████║
// ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝
const getSubscriptionsRequest = () => ({
  type: GET_SUBSCRIPTIONS_REQUEST,
  loading: true,
  error: null
});
const getSubscriptionsSuccess = ({ subscriptions, reset, newOffset }) => ({
  type: GET_SUBSCRIPTIONS_SUCCESS,
  hasMore: reset ? true : subscriptions.length > 0,
  offset: newOffset,
  subscriptions,
  reset
});
export const getSubscriptions = ({ reset = false, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const subscriptionState = getState().subscriptions;
    const offset = reset ? 0 : subscriptionState.offset;
    if (subscriptionState.loading) {
      console.log("loading...");
    } else {
      dispatch(getSubscriptionsRequest());
      FETCH("/v1/site/subscriptions", {
        dispatch,
        token,
        params: {
          limit: subscriptionState.limit,
          offset: offset
        }
      }).then(r => {
        if (r.result) {
          const dispatchData = {
            subscriptions: r.result,
            reset,
            newOffset: offset + subscriptionState.limit
          };
          dispatch(getSubscriptionsSuccess(dispatchData));
          cb(r.result);
        }
        else {
          console.log('⭐️ ERROR', r);
        }
      });
    }
  };
};

// ███████╗██╗   ██╗██████╗    ██╗
// ██╔════╝██║   ██║██╔══██╗  ███║
// ███████╗██║   ██║██████╔╝  ╚██║
// ╚════██║██║   ██║██╔══██╗   ██║
// ███████║╚██████╔╝██████╔╝██╗██║
// ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝
const subscribeSuccess = () => ({
  type: SUBSCRIBE_SUCCESS
});
export const subscribe = siteId => (dispatch, getState) => {
  FETCH(`POST /v1/site/${siteId}/subscribe`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(subscribeSuccess(r.result));
  });
};

// ███████╗██╗   ██╗██████╗     ██████╗
// ██╔════╝██║   ██║██╔══██╗   ██╔═████╗
// ███████╗██║   ██║██████╔╝   ██║██╔██║
// ╚════██║██║   ██║██╔══██╗   ████╔╝██║
// ███████║╚██████╔╝██████╔╝██╗╚██████╔╝
// ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
export const unsubscribe = (siteId, _cb = () => {}) => (dispatch, getState) => {
  FETCH(`POST /v1/site/${siteId}/unsubscribe`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => _cb(r));
};

// ███╗   ██╗███████╗████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
// ████╗  ██║██╔════╝╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
// ██╔██╗ ██║█████╗     ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝
// ██║╚██╗██║██╔══╝     ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗
// ██║ ╚████║███████╗   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
// ╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
const getTrendingFromNetworkSuccess = networkSubscriptions => ({
  type: GET_TRENDING_FROM_NETWORK_SUCCESS,
  networkSubscriptions
});
export const getTrendingFromNetwork = () => (dispatch, getState) => {
  FETCH(`/v1/followings/chats/trending`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(getTrendingFromNetworkSuccess(r.result));
  });
};
