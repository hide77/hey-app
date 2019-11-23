import {
  CREATE_ENTRY_SUCCESS,
  DELETE_ENTRY_SUCCESS,
  FETCH_ENTRIES_SUCCESS,
  FETCH_ENTRY_SUCCESS,
  FETCH_ENTRY_CHILDREN_SUCCESS,
  FETCH_OTHER_ENTRIES,
  GET_PAGE_ID_SUCCESS,
  LIKE_ENTRY_FAILURE,
  LIKE_ENTRY_SUCCESS,
  REMOVE_BRAND_NEW,
  RESET_ERRORS,
  SEARCH_ENTRIES_SUCCESS,
  SELECT_REPLY_ENTRY,
  SITE_ID_REQUEST,
  SITE_ID_SUCCESS,
  SEARCH_ALL_SUCCESS,
} from 'hey-redux/types/entries';

const defaultState = {
  isLoading: false,
  searchResults: {hashtags: [], sites: [], users: []},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_ALL_SUCCESS:
      return Object.assign({}, state, action);
    case DELETE_ENTRY_SUCCESS:
      return Object.assign({}, state, action);
    case SITE_ID_REQUEST:
      return Object.assign({}, state, action);
    case SITE_ID_SUCCESS:
      return Object.assign({}, state, action);
    case GET_PAGE_ID_SUCCESS:
      return Object.assign({}, state, action);
    case FETCH_ENTRIES_SUCCESS:
      return Object.assign({}, state, {
        items: action.items,
        children: [],
      });
    case FETCH_ENTRY_SUCCESS:
      return Object.assign({}, state, {selectedItem: action.entry});
    case LIKE_ENTRY_SUCCESS:
      let child;
      const newChildren = state.children;
      const childIndex = state.children.indexOf(
        state.children.find(c => c._id === action.entryId),
      );
      const newEntries = state.items;
      const itemIndex = state.items.indexOf(
        state.items.find(e => e._id === action.entryId),
      );
      if (childIndex !== -1) {
        child = state.children[childIndex];
        newChildren[childIndex] = child;
        newChildren[childIndex].liked = !child.liked;
        newChildren[childIndex].nb_likes =
          child.nb_likes + (child.liked ? 1 : -1);
      } else {
        const entry = state.items[itemIndex];
        newEntries[itemIndex] = entry;
        newEntries[itemIndex].liked = !entry.liked;
        newEntries[itemIndex].nb_likes =
          entry.nb_likes + (entry.liked ? 1 : -1);
      }
      return Object.assign({}, state, {...action, children: newChildren});
    case LIKE_ENTRY_FAILURE:
      return Object.assign({}, state, {
        ...action,
        likeSuccess: false,
        errorLike: true,
      });
    case FETCH_ENTRY_CHILDREN_SUCCESS:
      return Object.assign({}, state, {children: action.children});
    case CREATE_ENTRY_SUCCESS:
      return Object.assign({}, state, action);
    case REMOVE_BRAND_NEW:
      return Object.assign({}, state, {brandNew: null});
    case SELECT_REPLY_ENTRY:
      return Object.assign({}, state, action);
    case SEARCH_ENTRIES_SUCCESS:
      return Object.assign({}, state, action);
    case FETCH_OTHER_ENTRIES:
      return Object.assign({}, state, action);
    case RESET_ERRORS:
      return Object.assign({}, state, {...action, errorLike: false});
    default:
      return state;
  }
};
