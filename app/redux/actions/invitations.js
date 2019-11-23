import { FETCH } from "hey-redux/mocks";

export const inviteUser = emails => (dispatch, getState) => {
  const token = getState().authentication.token;
  FETCH(`POST /v1/invitations`, {
    dispatch,
    json: true,
    token: getState().authentication.token,
    body: JSON.stringify({ emails })
  })
    .then(r => {
      console.log({ r });
    })
    .catch(function(e) {
      console.log("error", e);
    });
};
