import {
  UPDATE_SUBSCRIPTION,
  GET_TRENDING_FROM_NETWORK_SUCCESS,
  GET_SUBSCRIPTIONS_REQUEST,
  GET_SUBSCRIPTIONS_SUCCESS
} from "hey-redux/types/subscriptions";
import _ from "lodash";

const defaultState = {
  subscriptions: [],
  loading: false,
  error: false,
  hasMore: true,
  offset: 0,
  limit: 5000
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTIONS_REQUEST:
      return Object.assign({}, state, action);
    case GET_SUBSCRIPTIONS_SUCCESS:
      return Object.assign({}, state, {
        ...action,
        offset: action.newOffset,
        subscriptions: action.reset
          ? action.subscriptions
          : _.flatten([state.subscriptions, action.subscriptions]),
        hasMore: action.hasMore,
        loading: false
      });
    case UPDATE_SUBSCRIPTION:
      console.log({ state, action });
      state.subscriptions.map(sub=>{
        if(sub._id === action.site_id){
          console.log('found it', sub.host);
        }
      });
      return state;
    // return Object.assign({}, state, action);
    case GET_TRENDING_FROM_NETWORK_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
