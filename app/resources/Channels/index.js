import { FETCH } from "hey-redux/mocks";

export const createChannelResource = ({
  token,
  group_id,
  name = "",
  description = "",
  picture = {},
  privateChannel = false,
  question = ""
}) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/channels`, {
      token,
      stringify: true,
      json: true,
      body: {
        name,
        description,
        private: privateChannel,
        question
      }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const updateChannelResource = ({ token, channel_id, updateData }) => {
  return new Promise(resolve => {
    FETCH(`PATCH /v1/channels/${channel_id}`, {
      token,
      json: true,
      stringify: true,
      body: updateData
    }).then(async r => {
      resolve(r);
    });
  });
};

export const deleteChannelResource = ({ token, channel_id }) => {
  return new Promise(resolve => {
    FETCH(`DELETE /v1/channels/${channel_id}`, {
      token
    }).then(async r => {
      resolve(r);
    });
  });
};

export const getChannelMessagesResource = ({ token, channel_id }) => {
  return new Promise(resolve => {
    FETCH(`/v1/channels/${channel_id}/chats`, {
      token
    }).then(async r => {
      resolve(r);
    });
  });
};

export const getChannelEntriesResource = ({ token, channel_id }) => {
  return new Promise(resolve => {
    FETCH(`/v1/channels/${channel_id}/entries`, {
      token
    }).then(async r => {
      resolve(r);
    });
  });
};
