import io from "socket.io-client";
import { DEFAULT_API_URL } from "hey-redux/mocks";
import {
  CONNECT_TO_SOCKET_SUCCESS,
  DISCONNECT_FROM_SOCKET_SUCCESS
} from "hey-redux/types/io";
// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝
const connectToSocketSuccess = socket => ({
  type: CONNECT_TO_SOCKET_SUCCESS,
  socket
});
// react-native warning: https://stackoverflow.com/q/53638667/3170948
export const connectToSocket = () => (dispatch, getState) => {
  const token = getState().authentication.token;
  const socket = io(DEFAULT_API_URL, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  });
  dispatch(connectToSocketSuccess(socket));
};
const disconnectFromSocketSuccess = message => ({
  type: DISCONNECT_FROM_SOCKET_SUCCESS
});
export const disconnectFromSocket = () => (dispatch, getState) => {
  const socket = getState().io;
  socket.disconnect();
  dispatch(disconnectFromSocketSuccess());
};
