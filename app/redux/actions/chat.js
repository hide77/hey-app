import io from "socket.io-client";
import { DEFAULT_API_URL, FETCH } from "hey-redux/mocks";
import {
  APPEND_MESSAGE,
  APPEND_SELECTED_USER_SUCCESS,
  CONNECT_TO_SOCKET_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  DISCONNECT_FROM_SOCKET_SUCCESS,
  GET_MESSAGES_HISTORY_REQUEST,
  GET_MESSAGES_HISTORY_SUCCESS,
  RESTORE_MESSAGES_HISTORY_SUCCESS,
  GET_PRIVATE_CHATS_SUCCESS,
  GET_TRENDING_TOPICS_SUCCCESS,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_OF_A_CHAT_SUCCESS,
  LIKE_CHAT_MESSAGE_SUCCESS,
  REMOVE_SELECTED_USER_SUCCESS,
  UPDATE_CONNECTED_USERS_COUNT,
  GET_SITE_SUCCESS
} from "hey-redux/types/chat";
import { storeData } from "hey-mocks/AsyncStore";

// ███████╗██╗████████╗███████╗
// ██╔════╝██║╚══██╔══╝██╔════╝
// ███████╗██║   ██║   █████╗
// ╚════██║██║   ██║   ██╔══╝
// ███████║██║   ██║   ███████╗
// ╚══════╝╚═╝   ╚═╝   ╚══════╝
const getSiteSuccess = host => ({
  type: GET_SITE_SUCCESS,
  host
});
export const getSite = (host, _cb = () => {}) => (dispatch, getState) => {
  FETCH("/v1/site", {
    dispatch,
    token: getState().authentication.token,
    params: { host }
  }).then(r => {
    dispatch(getSiteSuccess(r.result));
    _cb(r.result);
  });
};

// ██╗     ██╗██╗  ██╗███████╗
// ██║     ██║██║ ██╔╝██╔════╝
// ██║     ██║█████╔╝ █████╗
// ██║     ██║██╔═██╗ ██╔══╝
// ███████╗██║██║  ██╗███████╗
// ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
const likeChatSuccess = (messageId, liked) => ({
  type: LIKE_CHAT_MESSAGE_SUCCESS,
  messageId,
  liked
});
export const likeChatMessage = messageId => (dispatch, getState) => {
  FETCH(`POST /v1/channels/chats/${messageId}/like`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    r.success && dispatch(likeChatSuccess(messageId, r.result.liked));
  });
};

// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
const deleteMessageSuccess = messageId => ({
  type: DELETE_MESSAGE_SUCCESS,
  messageId
});
export const deleteChatMessage = (messageId, cb = () => {}) => (
  dispatch,
  getState
) => {
  FETCH(`DELETE /v1/channels/chats/${messageId}`, {
    dispatch,
    token: getState().authentication.token
  }).then(cb);
};
export const messageDeleted = messageId => dispatch => {
  dispatch(deleteMessageSuccess(messageId));
};

// ██████╗ ███████╗███████╗███████╗████████╗
// ██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝
// ██████╔╝█████╗  ███████╗█████╗     ██║
// ██╔══██╗██╔══╝  ╚════██║██╔══╝     ██║
// ██║  ██║███████╗███████║███████╗   ██║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝
const resetChatMessagesSuccess = () => ({
  type: GET_MESSAGES_HISTORY_SUCCESS,
  chatMessages: []
});
export const resetChatMessages = () => dispatch => {
  dispatch(resetChatMessagesSuccess());
};

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
  const socket = getState().chat.socket;
  socket.disconnect();
  dispatch(disconnectFromSocketSuccess());
};

//  █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗██████╗
// ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗
// ███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ██║
// ██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║
// ██║  ██║██║     ██║     ███████╗██║ ╚████║██████╔╝
// ╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝
const appendMessageSuccess = (message, id) => ({
  type: APPEND_MESSAGE,
  message,
  id
});
export const appendMessage = message => (dispatch, getState) => {
  const id = message.user.id;
  message.id = message._id;
  dispatch(appendMessageSuccess(message, id));
};
// PRIVATE
const appendPrivateMessageSuccess = message => ({
  type: APPEND_MESSAGE,
  message,
  id: message.user.id,
  isPrivate: true
});
export const appendPrivateMessage = message => (dispatch, getState) => {
  if (message && message.user) {
    dispatch(appendPrivateMessageSuccess(message));
  }
};

// ██╗   ██╗    ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗
// ██║   ██║   ██╔════╝██╔═══██╗██║   ██║████╗  ██║╚══██╔══╝
// ██║   ██║   ██║     ██║   ██║██║   ██║██╔██╗ ██║   ██║
// ██║   ██║   ██║     ██║   ██║██║   ██║██║╚██╗██║   ██║
// ╚██████╔╝██╗╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║   ██║
//  ╚═════╝ ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝
const getUsersCountSuccess = userCount => ({
  type: GET_USERS_COUNT_SUCCESS,
  userCount
});
export const getUsersCount = siteId => (dispatch, getState) => {
  FETCH(`/v1/site/${siteId}/chat/users/count`, {
    dispatch,
    token: getState().authentication.token
  }).then(j => {
    dispatch(getUsersCountSuccess(j.result));
  });
};

//  ██████╗   ██╗   ██╗    ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗
// ██╔════╝   ██║   ██║   ██╔════╝██╔═══██╗██║   ██║████╗  ██║╚══██╔══╝
// ██║        ██║   ██║   ██║     ██║   ██║██║   ██║██╔██╗ ██║   ██║
// ██║        ██║   ██║   ██║     ██║   ██║██║   ██║██║╚██╗██║   ██║
// ╚██████╗██╗╚██████╔╝██╗╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║   ██║
//  ╚═════╝╚═╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝
const getUsersOfAChatSuccess = () => ({
  type: GET_USERS_OF_A_CHAT_SUCCESS
});
export const getUsersOfAChat = siteId => (dispatch, getState) => {
  FETCH(`/v1/site/${siteId}/chat/users`, {
    dispatch,
    token: getState().authentication.token
  }).then(j => {
    dispatch(getUsersOfAChatSuccess());
  });
};

// ██████╗ ███╗   ███╗   ██╗  ██╗██╗███████╗████████╗
// ██╔══██╗████╗ ████║   ██║  ██║██║██╔════╝╚══██╔══╝
// ██████╔╝██╔████╔██║   ███████║██║███████╗   ██║
// ██╔═══╝ ██║╚██╔╝██║   ██╔══██║██║╚════██║   ██║
// ██║     ██║ ╚═╝ ██║██╗██║  ██║██║███████║   ██║
// ╚═╝     ╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝
const getPrivateMessagesHistorySuccess = privateChatMessages => ({
  type: GET_MESSAGES_HISTORY_SUCCESS,
  privateChatMessages,
  isLoading: false
});
export const getPrivateMessagesHistory = userId => (dispatch, getState) => {
  dispatch(getMessagesHistoryRequest());
  FETCH(`/v1/users/${userId}/messages`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(getPrivateMessagesHistorySuccess(r.result));
  });
};

// ███╗   ███╗   ██╗  ██╗██╗███████╗████████╗
// ████╗ ████║   ██║  ██║██║██╔════╝╚══██╔══╝
// ██╔████╔██║   ███████║██║███████╗   ██║
// ██║╚██╔╝██║   ██╔══██║██║╚════██║   ██║
// ██║ ╚═╝ ██║██╗██║  ██║██║███████║   ██║
// ╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝
const getMessagesHistorySuccess = chatMessages => ({
  type: GET_MESSAGES_HISTORY_SUCCESS,
  chatMessages,
  isLoading: false
});
const getMessagesHistoryRequest = () => ({
  type: GET_MESSAGES_HISTORY_REQUEST,
  isLoading: true
});
export const getMessagesHistory = (siteId, createdAt) => (
  dispatch,
  getState
) => {
  dispatch(getMessagesHistoryRequest());
  FETCH(`/v1/site/${siteId}/chat/messages`, {
    dispatch,
    token: getState().authentication.token,
    params: {
      limit: 25,
      offset: 0
    }
  }).then(r => {
    storeData(`chat:${siteId}`, r.result, { json: true });
    dispatch(getMessagesHistorySuccess(r.result));
  });
};

// ███╗   ███╗   ██╗  ██╗██╗███████╗████████╗
// ████╗ ████║   ██║  ██║██║██╔════╝╚══██╔══╝
// ██╔████╔██║   ███████║██║███████╗   ██║

const restoreMessagesHistorySuccess = chatMessages => ({
  type: RESTORE_MESSAGES_HISTORY_SUCCESS,
  chatMessages
});
export const restoreMessagesHistory = (chatMessages, createdAt) => (
  dispatch,
  getState
) => {
  dispatch(getMessagesHistorySuccess(chatMessages));
};

//  ██████╗   ██╗   ██╗    ██████╗███╗   ██╗████████╗██╗   ██╗██████╗
// ██╔════╝   ██║   ██║   ██╔════╝████╗  ██║╚══██╔══╝██║   ██║██╔══██╗
// ██║        ██║   ██║   ██║     ██╔██╗ ██║   ██║   ██║   ██║██████╔╝
// ██║        ██║   ██║   ██║     ██║╚██╗██║   ██║   ██║   ██║██╔═══╝
// ╚██████╗██╗╚██████╔╝██╗╚██████╗██║ ╚████║   ██║██╗╚██████╔╝██║
//  ╚═════╝╚═╝ ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═══╝   ╚═╝╚═╝ ╚═════╝ ╚═╝
const updateConnectedUsersCountSuccess = userCount => ({
  type: UPDATE_CONNECTED_USERS_COUNT,
  userCount
});
export const updateConnectedUsersCount = userCount => dispatch => {
  dispatch(updateConnectedUsersCountSuccess(userCount));
};

// ██╗   ██╗    █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗██████╗
// ██║   ██║   ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗
// ██║   ██║   ███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ██║
// ██║   ██║   ██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║
// ╚██████╔╝██╗██║  ██║██║     ██║     ███████╗██║ ╚████║██████╔╝
//  ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝
const appendSelectedUserSuccess = (user, currentUserId) => ({
  type: APPEND_SELECTED_USER_SUCCESS,
  user,
  currentUserId
});
export const appendSelectedUser = user => (dispatch, getState) => {
  const currentUser = getState().user.result;
  const currentUserId = currentUser && currentUser._id;
  dispatch(appendSelectedUserSuccess(user, currentUserId));
};

// ██╗   ██╗   ██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗
// ██║   ██║   ██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝
// ██║   ██║   ██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗
// ██║   ██║   ██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝
// ╚██████╔╝██╗██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗
//  ╚═════╝ ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝
const removeSelectedUserSuccess = id => ({
  type: REMOVE_SELECTED_USER_SUCCESS,
  id
});
export const removeSelectedUser = id => dispatch => {
  dispatch(removeSelectedUserSuccess(id));
};

// ██████╗ ███╗   ███╗███████╗
// ██╔══██╗████╗ ████║██╔════╝
// ██████╔╝██╔████╔██║███████╗
// ██╔═══╝ ██║╚██╔╝██║╚════██║
// ██║     ██║ ╚═╝ ██║███████║
// ╚═╝     ╚═╝     ╚═╝╚══════╝
const getPrivateChatsSuccess = privateChats => ({
  type: GET_PRIVATE_CHATS_SUCCESS,
  privateChats
});
export const getPrivateChats = () => (dispatch, getState) => {
  FETCH(`/v1/chats/private`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    dispatch(getPrivateChatsSuccess(r.result));
  });
};

// ████████╗██████╗ ███████╗███╗   ██╗██████╗ ██╗███╗   ██╗ ██████╗
// ╚══██╔══╝██╔══██╗██╔════╝████╗  ██║██╔══██╗██║████╗  ██║██╔════╝
//    ██║   ██████╔╝█████╗  ██╔██╗ ██║██║  ██║██║██╔██╗ ██║██║  ███╗
//    ██║   ██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║██║██║╚██╗██║██║   ██║
//    ██║   ██║  ██║███████╗██║ ╚████║██████╔╝██║██║ ╚████║╚██████╔╝
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
const getTrendingTopicsSuccess = trendingTopics => ({
  type: GET_TRENDING_TOPICS_SUCCCESS,
  trendingTopics
});
export const getTrendingTopics = () => (dispatch, getState) => {
  FETCH(`/v1/chats/trending`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(getTrendingTopicsSuccess(r.result));
  });
};
