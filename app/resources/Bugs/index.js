import { FETCH } from "hey-redux/mocks";

const BUG_CHANNEL = "#feedback";

export const reportBug = ({ message, channel = BUG_CHANNEL, token }) => {
  if (!message)
    message =
      "I have a bug.. good luck 😂";
  FETCH("POST /v1/bug", {
    json: true,
    token,
    body: JSON.stringify({
      message,
      channel
    })
  }).then(async r => {
    console.log("bug reported", r);
  });
};
