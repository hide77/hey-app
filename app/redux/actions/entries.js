import { FETCH } from "hey-redux/mocks";
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
  SEARCH_ALL_SUCCESS
} from "hey-redux/types/entries";

const searchAllSuccess = searchResults => ({
  type: SEARCH_ALL_SUCCESS,
  searchResults
});

export const searchAll = search => (dispatch, getState) => {
  return FETCH(`/v1/search`, {
    dispatch,
    params: { search },
    token: getState().authentication.token
  }).then(r => {
    dispatch(searchAllSuccess(r.result));
  });
};

const searchEntriesSuccess = q => ({
  type: SEARCH_ENTRIES_SUCCESS,
  q
});

export const searchEntries = q => (dispatch, getState) => {
  dispatch(searchEntriesSuccess(q));
  const {
    entries: { page },
    authentication: { token }
  } = getState();
  dispatch(fetchEntries(page._id, token, q));
};

const siteIdRequest = () => ({
  type: SITE_ID_REQUEST,
  isLoading: true
});

const siteIdSuccess = (site, hostname) => ({
  type: SITE_ID_SUCCESS,
  isLoading: false,
  site
});

export const getSiteId = (site, _cb = () => {}, subscribe = () => {}) => (
  dispatch,
  getState
) => {
  dispatch(siteIdRequest());
  FETCH(`/v1/site`, {
    dispatch,
    params: {
      host: site,
      language: "en"
    },
    token: getState().authentication.token
  })
    .then((r = {}) => {
      if (r.success) {
        dispatch(siteIdSuccess(r.result, site));
        _cb({ id: r.result._id, host: r.result.host });
        subscribe(r.result._id);
      }
    })
    .catch(e => {
      console.log("error get site", e);
    });
};

const getPageIdSuccess = page => ({
  type: GET_PAGE_ID_SUCCESS,
  page
});

const getPageId = (dispatch, site_id, token, path) => {
  FETCH(`/v1/site/${site_id}/page`, {
    dispatch,
    params: { path },
    token
  }).then(r => {
    dispatch(getPageIdSuccess(r.result));
    getPageById(dispatch, r.result._id, token);
  });
};

const getPageById = (dispatch, page_id, token) => {
  FETCH(`/v1/pages/${page_id}`, {
    dispatch,
    token
  }).then(r => {
    dispatch(fetchEntries(r.result._id, token));
  });
};

const createEntrySuccess = entryId => ({
  type: CREATE_ENTRY_SUCCESS,
  brandNew: entryId
});

const removeBrandNew = () => ({
  type: REMOVE_BRAND_NEW
});

export const createEntry = (
  content,
  page_id,
  token,
  parent = "",
  snippetContent = "",
  snippetLanguage = "markdown"
) => (dispatch, getState) => {
  const pageId = page_id ? page_id : getState().entries.page._id;
  FETCH(`POST /v1/pages/${pageId}/entries`, {
    dispatch,
    token,
    json: true,
    body: JSON.stringify({
      content: content,
      parent,
      snippet: {
        content: snippetContent,
        language: snippetLanguage
      }
    })
  }).then(r => {
    if (!r.success) return;
    dispatch(createEntrySuccess(r.result._id));
    if (parent) dispatch(fetchEntryChildren(parent, token));
    else dispatch(fetchEntries());
  });
};

const fetchEntriesSuccess = items => ({
  type: FETCH_ENTRIES_SUCCESS,
  items
});

export const fetchEntries = (page_id, token, q = "") => (
  dispatch,
  getState
) => {
  const page = getState().entries.page;
  const pageId = !page_id ? (page ? page._id : null) : page_id;
  if (pageId === null) return;

  FETCH(`/v1/pages/${pageId}/entries?search=${q}`, {
    dispatch,
    token
  }).then(j => {
    dispatch(fetchEntriesSuccess(j.result));
    dispatch(fetchOtherEntriesOnTheWebsite(token));
  });
};

const fetchOtherEntriesSuccess = otherItems => ({
  type: FETCH_OTHER_ENTRIES,
  otherItems
});

export const fetchOtherEntriesOnTheWebsite = (token, q = "") => (
  dispatch,
  getState
) => {
  const site_id = getState().entries.site._id;
  FETCH(`/v1/site/${site_id}/entries?search=${q}`, {
    dispatch,
    token
  }).then(r => dispatch(fetchOtherEntriesSuccess(r.result)));
};

const likeEntrySuccess = entryId => ({ type: LIKE_ENTRY_SUCCESS, entryId });

const likeEntryFailure = () => ({ type: LIKE_ENTRY_FAILURE });

export const likeEntry = (entry_id, token) => dispatch => {
  FETCH(`POST /v1/entries/${entry_id}/like`, {
    dispatch,
    token,
    json: true
  }).then(j => {
    if (r.success) {
      dispatch(likeEntrySuccess(entry_id));
    } else dispatch(likeEntryFailure());
  });
};

const fetchEntrySuccess = entry => ({
  type: FETCH_ENTRY_SUCCESS,
  entry
});

export const fetchEntry = (entry_id, token) => dispatch => {
  FETCH(`/v1/entries/${entry_id}`, {
    dispatch,
    token
  }).then(r => dispatch(fetchEntrySuccess(r.result)));
};

const fetchEntryChildrenSuccess = children => ({
  type: FETCH_ENTRY_CHILDREN_SUCCESS,
  children
});

export const fetchEntryChildren = (entry_id, token) => dispatch => {
  FETCH(`/v1/entries/${entry_id}/entries`, {
    dispatch,
    token
  }).then(j => dispatch(fetchEntryChildrenSuccess(j.result)));
};

const selectedReplyEntry = replyEntry => ({
  type: SELECT_REPLY_ENTRY,
  replyEntry
});

export const selectReplyEntry = entry => dispatch => {
  dispatch(selectedReplyEntry(entry));
};

export const removeReplyEntry = entry => (dispatch, getState) => {
  if (getState().entries.selectedEntryId) {
    dispatch(selectedReplyEntry(null));
  }
};

const deleteEntrySuccess = () => ({
  type: DELETE_ENTRY_SUCCESS
});

export const deleteEntry = entryId => (dispatch, getState) => {
  const token = getState().authentication.token;
  FETCH(`DELETE /v1/entries/${entryId}`, {
    dispatch,
    token,
    json: true
  }).then(j => {
    if (r.success) {
      dispatch(deleteEntrySuccess());
      dispatch(fetchEntries());
      const parentId = getState().navigation.selectedEntryId;
      if (parentId) dispatch(fetchEntryChildren(parentId, token));
    }
  });
};

const resetErrorsSuccess = () => ({ type: RESET_ERRORS });

export const resetErrors = () => dispatch => {
  dispatch(resetErrorsSuccess());
};
