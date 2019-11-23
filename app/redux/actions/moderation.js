import { FETCH } from "hey-redux/mocks";
import { BLOCK_USER, REPORT_USER, REPORT_POST } from "hey-redux/types/moderation";

const blockUserSuccess = () => {};

export const blockUser = userId => (dispatch, getState) => {
  FETCH(`POST /v1/users/${userId}/block`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(blockUserSuccess(r.result));
  });
};

const reportUserSuccess = () => {};

export const reportUser = userId => (dispatch, getState) => {
  FETCH(`POST /v1/users/${userId}/report`, {
    dispatch,
    token: getState().authentication.token
  }).then(r => {
    if (r.result) dispatch(reportUserSuccess(r.result));
  });
};

const reportPostSuccess = () => {};

export const reportPost = (postId, type, comment = null) => (
  dispatch,
  getState
) => {
  FETCH(`POST /v1/chats/${postId}/report`, {
    dispatch,
    token: getState().authentication.token,
    json: true,
    body: JSON.stringify({
      type,
      comment
    })
  }).then(r => {
    if (r.result) dispatch(reportPostSuccess(r.result));
  });
};
