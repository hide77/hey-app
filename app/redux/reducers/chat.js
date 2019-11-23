import {
  APPEND_MESSAGE,
  APPEND_SELECTED_USER_SUCCESS,
  CONNECT_TO_SOCKET_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  DISCONNECT_FROM_SOCKET_SUCCESS,
  GET_MESSAGES_HISTORY_REQUEST,
  RESTORE_MESSAGES_HISTORY_SUCCESS,
  GET_MESSAGES_HISTORY_SUCCESS,
  GET_PRIVATE_CHATS_SUCCESS,
  GET_TRENDING_TOPICS_SUCCCESS,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_OF_A_CHAT_SUCCESS,
  LIKE_CHAT_MESSAGE_SUCCESS,
  REMOVE_SELECTED_USER_SUCCESS,
  UPDATE_CONNECTED_USERS_COUNT,
  GET_SITE_SUCCESS
} from "hey-redux/types/chat";

const defaultState = {
  userCount: 0,
  chatMessages: [],
  privateChatMessages: [],
  selectedUser: null,
  privateChats: [],
  trendingTopics: [],
  isLoading: true
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case DELETE_MESSAGE_SUCCESS:
      const chatMessages = state.chatMessages.filter(
        message => message.id !== action.messageId
      );
      return Object.assign({}, state, { chatMessages, ...action });
    case LIKE_CHAT_MESSAGE_SUCCESS:
      const index = state.chatMessages.indexOf(
        state.chatMessages.find(message => message._id === action.messageId)
      );
      let newChatMessages = state.chatMessages;
      newChatMessages[index].liked = action.liked;
      newChatMessages[index].nb_likes =
        newChatMessages[index].nb_likes + (action.liked ? 1 : -1);
      return Object.assign({}, state, {
        ...action,
        chatMessages: newChatMessages
      });
    case APPEND_MESSAGE:
      if (action.isPrivate) {
        return Object.assign({}, state, {
          ...action,
          privateChatMessages: [
            {
              ...action.message,
              user: { ...action.message.user, _id: action.id }
            },
            ...state.privateChatMessages
          ]
        });
      }
      return Object.assign({}, state, {
        ...action,
        chatMessages: [
          {
            ...action.message,
            user: { ...action.message.user, _id: action.id },
            tagged_users: []
          },
          ...state.chatMessages
        ],
        selectedUser: null
      });
    case GET_USERS_OF_A_CHAT_SUCCESS:
      return Object.assign({}, state, action);
    case GET_USERS_COUNT_SUCCESS:
      return Object.assign({}, state, action);
    case GET_MESSAGES_HISTORY_SUCCESS:
      return Object.assign({}, state, action);
    case RESTORE_MESSAGES_HISTORY_SUCCESS:
      return Object.assign({}, state, action);
    case CONNECT_TO_SOCKET_SUCCESS:
      return Object.assign({}, state, action);
    case DISCONNECT_FROM_SOCKET_SUCCESS:
      return Object.assign({}, state, action);
    case UPDATE_CONNECTED_USERS_COUNT:
      return Object.assign({}, state, action);
    case APPEND_SELECTED_USER_SUCCESS:
      return Object.assign({}, state, {
        ...action,
        selectedUser:
          action.user._id !== action.currentUserId
            ? action.user
            : state.selectedUser
      });
    case REMOVE_SELECTED_USER_SUCCESS:
      return Object.assign({}, state, { selectedUser: null, ...action });
    case GET_PRIVATE_CHATS_SUCCESS:
      return Object.assign({}, state, action);
    case GET_TRENDING_TOPICS_SUCCCESS:
      return Object.assign({}, state, action);
    case GET_SITE_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
