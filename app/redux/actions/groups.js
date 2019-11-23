import { FETCH } from "hey-redux/mocks";
import {
  GET_GROUPS_REQUEST,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_ERROR,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_ERROR,
  UPDATE_GROUP_REQUEST,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_ERROR,
  GET_CURRENT_GROUP_REQUEST,
  GET_CURRENT_GROUP_SUCCESS,
  GET_CURRENT_GROUP_ERROR,
  GET_JOINED_GROUPS_REQUEST,
  GET_JOINED_GROUPS_SUCCESS,
  GET_JOINED_GROUPS_ERROR,
  SET_CURRENT_CHANNEL,
  DELETE_GROUP_REQUEST,
  DELETE_GROUP_SUCCESS,
  DELETE_GROUP_ERROR,
  ADD_CHANNEL_TO_GROUP_REQUEST,
  ADD_CHANNEL_TO_GROUP_SUCCESS,
  ADD_CHANNEL_TO_GROUP_ERROR,
  REMOVE_CHANNEL_FROM_GROUP_REQUEST,
  REMOVE_CHANNEL_FROM_GROUP_SUCCESS,
  REMOVE_CHANNEL_FROM_GROUP_ERROR,
  UPDATE_CHANNEL_REQUEST,
  UPDATE_CHANNEL_SUCCESS,
  UPDATE_CHANNEL_ERROR,
  LEAVE_GROUP_REQUEST,
  LEAVE_GROUP_SUCCESS,
  LEAVE_GROUP_ERROR,
  GENERATE_SHARE_TOKEN_REQUEST,
  GENERATE_SHARE_TOKEN_SUCCESS,
  GENERATE_SHARE_TOKEN_ERROR,
  DESTROY_SHARE_TOKEN_REQUEST,
  DESTROY_SHARE_TOKEN_SUCCESS,
  DESTROY_SHARE_TOKEN_ERROR,
  JOIN_GROUP_W_TOKEN_REQUEST,
  JOIN_GROUP_W_TOKEN_SUCCESS,
  JOIN_GROUP_W_TOKEN_ERROR,
  JOIN_GROUP_REQUEST,
  JOIN_GROUP_SUCCESS,
  JOIN_GROUP_ERROR,
  SET_SHARE_TOKEN_REQUEST,
  SET_SHARE_TOKEN_SUCCESS,
  SET_SHARE_TOKEN_ERROR
} from "hey-redux/types/groups";
import {
  adminCreateGroupResource,
  adminUpdateGroupResource,
  adminDeleteGroupResource,
  adminGroupPendingResource,
  getGroupsResource,
  getJoinedGroupsResource,
  getGroupResource,
  discoverGroupsResource,
  joinGroupResource,
  joinPrivateGroupWithShareTokenResource,
  leaveGroupResource,
  generateShareTokenResource,
  setShareTokenResource,
  destroyShareTokenResource
} from "hey-resources/Groups";
import {
  createChannelResource,
  updateChannelResource,
  deleteChannelResource
} from "hey-resources/Channels";
import { getData, storeData } from "hey-mocks/AsyncStore";

const createGroupRequest = () => ({
  type: CREATE_GROUP_REQUEST,
  createGroupLoading: true,
  error: null
});
const createGroupSuccess = ({ group }) => ({
  type: CREATE_GROUP_SUCCESS,
  group
});
const createGroupError = ({ error }) => ({
  type: CREATE_GROUP_ERROR,
  createGroupLoading: false,
  error
});

export const createGroup = ({
  name,
  description,
  privateGroup = false,
  pictures,
  question,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.createGroupLoading) {
      console.log("loading createGroup...");
    } else {
      dispatch(createGroupRequest());
      adminCreateGroupResource({
        name,
        description,
        privateGroup,
        pictures,
        question,
        token
      }).then(r => {
        if (r.result) {
          r.result.is_owner = true;
          r.result.is_admin = true;
          r.result.is_member = true;
          const dispatchData = {
            group: r.result
          };
          console.log("⭐️ createGroup", dispatchData);
          dispatch(createGroupSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(createGroupError({ r }));
          console.log("⭐️ ERROR getGroups", r);
          cb(r);
        }
      });
    }
  };
};

const updateGroupRequest = () => ({
  type: UPDATE_GROUP_REQUEST,
  updateGroupLoading: true,
  error: null
});
const updateGroupSuccess = ({ group }) => ({
  type: UPDATE_GROUP_SUCCESS,
  group
});
const updateGroupError = ({ error }) => ({
  type: UPDATE_GROUP_ERROR,
  updateGroupLoading: false,
  error
});

export const updateGroup = ({
  group_id,
  name,
  description,
  privateGroup,
  pictures,
  question,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.updateGroupLoading) {
      console.log("loading updateGroup...");
    } else {
      dispatch(updateGroupRequest());
      adminUpdateGroupResource({
        group_id,
        name,
        description,
        privateGroup,
        pictures,
        question,
        token
      }).then(r => {
        if (r.result) {
          r.result.is_owner = true;
          r.result.is_admin = true;
          r.result.is_member = true;
          const dispatchData = {
            group: r.result
          };
          console.log("⭐️ updateGroup", dispatchData);
          dispatch(updateGroupSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(updateGroupError({ r }));
          console.log("⭐️ ERROR getGroups", r);
        }
      });
    }
  };
};

const getGroupsRequest = () => ({
  type: GET_GROUPS_REQUEST,
  getGroupsLoading: true,
  error: null
});
const getGroupsSuccess = ({ groups }) => ({
  type: GET_GROUPS_SUCCESS,
  groups,
  getGroupsLoading: false,
  error: null
});
const getGroupsError = ({ error }) => ({
  type: GET_GROUPS_ERROR,
  getGroupsLoading: false,
  error
});

export const getGroups = ({ cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.getGroupsLoading) {
      console.log("loading getGroups...");
    } else {
      dispatch(getGroupsRequest());
      discoverGroupsResource({ token }).then(r => {
        if (r.result) {
          const dispatchData = {
            groups: r.result
          };
          console.log("⭐️ getGroups", r.result);
          dispatch(getGroupsSuccess(dispatchData));
          cb(r.result);
        } else {
          cb(r);
          dispatch(getGroupsError({ r }));
          console.log("⭐️ ERROR getGroups", r);
        }
      });
    }
  };
};

const getCurrentGroupRequest = () => ({
  type: GET_CURRENT_GROUP_REQUEST,
  getCurrentGroupLoading: true,
  error: null
});

const getCurrentGroupSuccess = ({ currentGroup }) => ({
  type: GET_CURRENT_GROUP_SUCCESS,
  currentGroup,
  getCurrentGroupLoading: false,
  error: null
});
const getCurrentGroupError = ({ error }) => ({
  type: GET_CURRENT_GROUP_ERROR,
  getCurrentGroupLoading: false,
  error
});

export const getCurrentGroup = ({ group, group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.getCurrentGroupLoading) {
      console.log("loading getCurrentGroup...");
    } else {
      dispatch(getCurrentGroupRequest());
      if (group) {
        let orderedChannels = group.channels.sort(function(a, b) {
          var keyA = new Date(a.last_message_at),
            keyB = new Date(b.last_message_at);
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        group.channels = orderedChannels;
        const dispatchData = {
          currentGroup: group
        };
        dispatch(getCurrentGroupSuccess(dispatchData));
        cb(group);
      } else {
        getGroupResource({ token, group_id }).then(r => {
          if (r.result) {
            let orderedChannels = r.result.channels.sort(function(a, b) {
              var keyA = new Date(a.last_message_at),
                keyB = new Date(b.last_message_at);
              // Compare the 2 dates
              if (keyA < keyB) return 1;
              if (keyA > keyB) return -1;
              return 0;
            });
            r.result.channels = orderedChannels;
            const dispatchData = {
              currentGroup: r.result
            };
            dispatch(getCurrentGroupSuccess(dispatchData));
            console.log("⭐️ getCurrentGroup", r);
            cb(r);
          } else {
            dispatch(getCurrentGroupError({ r }));
            console.log("⭐️ ERROR getCurrentGroup", r);
            cb(r);
          }
        });
      }
    }
  };
};

const getJoinedGroupsRequest = () => ({
  type: GET_JOINED_GROUPS_REQUEST,
  getJoinedGroupsLoading: true,
  error: null
});
const getJoinedGroupsSuccess = ({ groups }) => ({
  type: GET_JOINED_GROUPS_SUCCESS,
  joinedGroups: groups,
  getJoinedGroupsLoading: false,
  error: null
});
const getJoinedGroupsError = ({ error }) => ({
  type: GET_JOINED_GROUPS_ERROR,
  getJoinedGroupsLoading: false,
  error
});

export const getJoinedGroups = ({ cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.getJoinedGroupsLoading) {
      console.log("loading getJoinedGroups...");
    } else {
      dispatch(getJoinedGroupsRequest());
      getJoinedGroupsResource({ token }).then(r => {
        if (r.result) {
          const dispatchData = {
            groups: r.result
          };
          console.log("⭐️ getJoinedGroups", r.result);
          dispatch(getJoinedGroupsSuccess(dispatchData));
          cb(r.result);
        } else {
          cb(r);
          dispatch(getJoinedGroupsError({ r }));
          console.log("⭐️ ERROR getJoinedGroups", r);
        }
      });
    }
  };
};

export const setCurrentChannel = channel => (dispatch, getState) => {
  dispatch({
    type: SET_CURRENT_CHANNEL,
    currentChannel: channel
  });
};

const deleteGroupRequest = () => ({
  type: DELETE_GROUP_REQUEST,
  deleteGroupLoading: true,
  error: null
});

const deleteGroupSuccess = ({ group_id }) => ({
  type: DELETE_GROUP_SUCCESS,
  group_id
});
const deleteGroupError = ({ error }) => ({
  type: DELETE_GROUP_ERROR,
  deleteGroupLoading: false,
  error
});

export const deleteGroup = ({ group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.deleteGroupLoading) {
      console.log("loading deleteGroup...");
    } else {
      dispatch(deleteGroupRequest());
      adminDeleteGroupResource({ token, group_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            group_id
          };
          dispatch(deleteGroupSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(deleteGroupError({ r }));
          console.log("⭐️ ERROR deleteGroup", r);
        }
      });
    }
  };
};

const leaveGroupRequest = () => ({
  type: LEAVE_GROUP_REQUEST,
  leaveGroupLoading: true,
  error: null
});

const leaveGroupSuccess = ({ group_id }) => ({
  type: LEAVE_GROUP_SUCCESS,
  group_id,
  leaveGroupLoading: false,
  error: null
});
const leaveGroupError = ({ error }) => ({
  type: LEAVE_GROUP_ERROR,
  leaveGroupLoading: false,
  error
});

export const leaveGroup = ({ group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.leaveGroupLoading) {
      console.log("loading leaveGroup...");
    } else {
      dispatch(leaveGroupRequest());
      leaveGroupResource({ token, group_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            group_id
          };
          dispatch(leaveGroupSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(leaveGroupError({ r }));
          console.log("⭐️ ERROR leaveGroup", r);
        }
      });
    }
  };
};

const joinGroupRequest = () => ({
  type: JOIN_GROUP_REQUEST,
  joinGroupLoading: true,
  error: null
});

const joinGroupSuccess = ({ group }) => ({
  type: JOIN_GROUP_SUCCESS,
  group,
  joinGroupLoading: false,
  error: null
});
const joinGroupError = ({ error }) => ({
  type: JOIN_GROUP_ERROR,
  joinGroupLoading: false,
  error
});

export const joinGroup = ({ group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.joinGroupLoading) {
      console.log("loading joinGroup...");
    } else {
      dispatch(joinGroupRequest());
      joinGroupResource({ token, group_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            group: r.result
          };
          dispatch(joinGroupSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(joinGroupError({ r }));
          console.log("⭐️ ERROR joinGroup", r);
        }
      });
    }
  };
};

const joinGroupWTokenRequest = () => ({
  type: JOIN_GROUP_W_TOKEN_REQUEST,
  joinGroupWTokenLoading: true,
  error: null
});

const joinGroupWTokenSuccess = ({ group }) => ({
  type: JOIN_GROUP_W_TOKEN_SUCCESS,
  group,
  joinGroupWTokenLoading: false,
  error: null
});
const joinGroupWTokenError = ({ error }) => ({
  type: JOIN_GROUP_W_TOKEN_ERROR,
  joinGroupWTokenLoading: false,
  error
});

export const joinGroupWToken = ({
  group_id,
  shareToken,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.joinGroupWTokenLoading) {
      console.log("loading joinGroupWToken...");
    } else {
      dispatch(joinGroupWTokenRequest());
      joinPrivateGroupWithShareTokenResource({ token, shareToken }).then(r => {
        if (r.success) {
          const dispatchData = {
            group: r.result
          };
          dispatch(joinGroupWTokenSuccess(dispatchData));
          cb(r);
        } else {
          dispatch(joinGroupWTokenError({ r }));
          console.log("⭐️ ERROR joinGroupWToken", r);
        }
      });
    }
  };
};

const addChannelToGroupRequest = () => ({
  type: ADD_CHANNEL_TO_GROUP_REQUEST,
  addChannelToGroupLoading: true,
  error: null
});

const addChannelToGroupSuccess = ({ channel }) => ({
  type: ADD_CHANNEL_TO_GROUP_SUCCESS,
  addChannelToGroupLoading: false,
  channel
});
const addChannelToGroupError = ({ error }) => ({
  type: ADD_CHANNEL_TO_GROUP_ERROR,
  addChannelToGroupLoading: false,
  error
});

export const addChannelToGroup = ({
  group_id,
  name,
  privateChannel,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.addChannelToGroupLoading) {
      console.log("loading addChannelToGroup...");
    } else {
      dispatch(addChannelToGroupRequest());
      createChannelResource({ token, group_id, name, privateChannel }).then(
        r => {
          if (r.result) {
            const dispatchData = {
              channel: r.result
            };
            dispatch(addChannelToGroupSuccess(dispatchData));
            console.log("⭐️ addChannelToGroup", r);
            cb(r);
          } else {
            dispatch(addChannelToGroupError({ r }));
            console.log("⭐️ ERROR addChannelToGroup", r);
          }
        }
      );
    }
  };
};

const removeChannelFromGroupRequest = () => ({
  type: REMOVE_CHANNEL_FROM_GROUP_REQUEST,
  removeChannelFromGroupLoading: true,
  error: null
});

const removeChannelFromGroupSuccess = ({ channel_id }) => ({
  type: REMOVE_CHANNEL_FROM_GROUP_SUCCESS,
  removeChannelFromGroupLoading: false,
  channel_id
});
const removeChannelFromGroupError = ({ error }) => ({
  type: REMOVE_CHANNEL_FROM_GROUP_ERROR,
  removeChannelFromGroupLoading: false,
  error
});

export const removeChannelFromGroup = ({ channel_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.removeChannelFromGroupLoading) {
      console.log("loading removeChannelFromGroup...");
    } else {
      dispatch(removeChannelFromGroupRequest());
      deleteChannelResource({ token, channel_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            channel_id
          };
          dispatch(removeChannelFromGroupSuccess(dispatchData));
          console.log("⭐️ removeChannelFromGroup", r);
          cb(r);
        } else {
          dispatch(removeChannelFromGroupError({ r }));
          console.log("⭐️ ERROR removeChannelFromGroup", r);
        }
      });
    }
  };
};

const updateChannelRequest = () => ({
  type: UPDATE_CHANNEL_REQUEST,
  updateChannelLoading: true,
  error: null
});

const updateChannelSuccess = ({ channel }) => ({
  type: UPDATE_CHANNEL_SUCCESS,
  updateChannelLoading: false,
  channel
});
const updateChannelError = ({ error }) => ({
  type: UPDATE_CHANNEL_ERROR,
  updateChannelLoading: false,
  error
});

export const updateChannel = ({
  channel_id,
  updateData,
  cb = () => {}
} = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.updateChannelLoading) {
      console.log("loading updateChannel...");
    } else {
      dispatch(updateChannelRequest());
      updateChannelResource({
        token,
        channel_id,
        updateData
      }).then(r => {
        if (r.result) {
          const dispatchData = {
            channel: r.result
          };
          dispatch(updateChannelSuccess(dispatchData));
          console.log("⭐️ updateChannel", r);
          cb(r);
        } else {
          dispatch(updateChannelError({ r }));
          console.log("⭐️ ERROR updateChannel", r);
        }
      });
    }
  };
};

const generateShareTokenRequest = () => ({
  type: GENERATE_SHARE_TOKEN_REQUEST,
  generateShareTokenLoading: true,
  error: null
});

const generateShareTokenSuccess = ({ shareToken }) => ({
  type: GENERATE_SHARE_TOKEN_SUCCESS,
  generateShareTokenLoading: false,
  shareToken
});
const generateShareTokenError = ({ error }) => ({
  type: GENERATE_SHARE_TOKEN_ERROR,
  generateShareTokenLoading: false,
  error
});

export const generateShareToken = ({ group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.generateShareTokenLoading) {
      console.log("loading generateShareToken...");
    } else {
      dispatch(generateShareTokenRequest());
      generateShareTokenResource({ token, group_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            shareToken: r.result.token
          };
          dispatch(generateShareTokenSuccess(dispatchData));
          console.log("⭐️ generateShareToken", r);
          cb(r);
        } else {
          dispatch(generateShareTokenError({ r }));
          console.log("⭐️ ERROR generateShareToken", r);
        }
      });
    }
  };
};

const setShareTokenRequest = () => ({
  type: SET_SHARE_TOKEN_REQUEST,
  setShareTokenLoading: true,
  error: null
});

const setShareTokenSuccess = ({ tokenName }) => ({
  type: SET_SHARE_TOKEN_SUCCESS,
  setShareTokenLoading: false,
  tokenName
});
const setShareTokenError = ({ error }) => ({
  type: SET_SHARE_TOKEN_ERROR,
  setShareTokenLoading: false,
  error
});

export const setShareToken = ({ tokenName, group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.setShareTokenLoading) {
      console.log("loading setShareToken...");
    } else {
      dispatch(setShareTokenRequest());
      setShareTokenResource({ token, tokenName, group_id }).then(r => {
        if (r.result) {
          const dispatchData = {
            tokenName
          };
          dispatch(setShareTokenSuccess(dispatchData));
          console.log("⭐️ setShareToken", r);
          cb(r);
        } else {
          dispatch(setShareTokenError({ r }));
          console.log("⭐️ ERROR setShareToken", r);
        }
      });
    }
  };
};

const destroyShareTokenRequest = () => ({
  type: DESTROY_SHARE_TOKEN_REQUEST,
  destroyShareTokenLoading: true,
  error: null
});

const destroyShareTokenSuccess = () => ({
  type: DESTROY_SHARE_TOKEN_SUCCESS,
  destroyShareTokenLoading: false
});
const destroyShareTokenError = ({ error }) => ({
  type: DESTROY_SHARE_TOKEN_ERROR,
  destroyShareTokenLoading: false,
  error
});

export const destroyShareToken = ({ group_id, cb = () => {} } = {}) => {
  return (dispatch, getState) => {
    const token = getState().authentication.token;
    const groupState = getState().groups;
    if (groupState.destroyShareTokenLoading) {
      console.log("loading destroyShareToken...");
    } else {
      dispatch(destroyShareTokenRequest());
      destroyShareTokenResource({ token, group_id }).then(r => {
        if (r.result) {
          dispatch(destroyShareTokenSuccess());
          console.log("⭐️ destroyShareToken", r);
          cb(r);
        } else {
          dispatch(destroyShareTokenError({ r }));
          console.log("⭐️ ERROR destroyShareToken", r);
        }
      });
    }
  };
};
