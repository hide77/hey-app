import {
  CONNECT_TO_SOCKET_SUCCESS,
  DISCONNECT_FROM_SOCKET_SUCCESS
} from "hey-redux/types/io";

const defaultState = {};
export default (state = defaultState, action) => {
  switch (action.type) {
    case CONNECT_TO_SOCKET_SUCCESS:
      return Object.assign({}, state, {
        socket: action.socket
      });
    case DISCONNECT_FROM_SOCKET_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
