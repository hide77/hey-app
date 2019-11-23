import { FETCH } from "hey-redux/mocks";

//  █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
// ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
// ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
// ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
export const adminGetGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH("/v1/groups", { token }).then(async r => {
      resolve(r);
    });
  });
};

export const adminDeleteGroupResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`DELETE /v1/groups/${group_id}`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const adminCreateGroupResource = ({
  name,
  description,
  privateGroup = false,
  pictures,
  question,
  token
}) => {
  return new Promise(resolve => {
    FETCH("POST /v1/groups", {
      json: true,
      token,
      body: JSON.stringify({
        name,
        description,
        private: privateGroup,
        pictures,
        question
      })
    }).then(async r => {
      resolve(r);
    });
  });
};

export const adminAbandonShipResource = ({ user_id, group_id, token }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/owner`, {
      json: true,
      token,
      body: JSON.stringify({
        user: user_id
      })
    }).then(async r => {
      resolve(r);
    });
  });
};

export const adminInviteUserResource = ({ user_id, group_id, token }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/invite`, {
      json: true,
      token,
      body: JSON.stringify({
        user: user_id
      })
    }).then(async r => {
      resolve(r);
    });
  });
};

export const adminRejectUserResource = ({ user_id, group_id, token }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/reject`, {
      json: true,
      token,
      body: JSON.stringify({
        user: user_id
      })
    }).then(async r => {
      resolve(r);
    });
  });
};

export const adminUpdateGroupResource = ({
  group_id,
  name,
  description,
  privateGroup,
  pictures,
  question,
  token
}) => {
  return new Promise(resolve => {
    const update_object = {};
    if (name !== null) {
      update_object.name = name;
    }
    if (description !== null) {
      update_object.description = description;
    }
    if (privateGroup !== null) {
      update_object.private = privateGroup;
    }
    if (pictures !== null) {
      update_object.pictures = pictures;
    }
    if (question !== null) {
      update_object.question = question;
    }
    FETCH(`PATCH /v1/groups/${group_id}`, {
      json: true,
      token,
      body: JSON.stringify(update_object)
    }).then(async r => {
      console.log("group updated", r);
      resolve(r);
    });
  });
};

export const adminGroupPendingResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`/v1/groups/${group_id}/requets/pending`, { token }).then(async r => {
      resolve(r);
    });
  });
};

// ██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗
// ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝
// ██████╔╝██║   ██║██████╔╝██║     ██║██║
// ██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║
// ██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗
// ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝

export const joinGroupResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/join`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const joinPrivateGroupWithShareTokenResource = ({
  token,
  shareToken
}) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/token/${shareToken}/join`, { token }).then(
      async r => {
        resolve(r);
      }
    );
  });
};

export const leaveGroupResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/leave`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const joinPrivateGroupResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/ask`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const getGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH(`/v1/groups`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const searchGroupsResource = ({
  token,
  search,
  deep = false,
  limit = 50,
  skip = 0
}) => {
  return new Promise(resolve => {
    FETCH(`/v1/groups`, {
      token,
      params: {
        limit,
        skip,
        deep,
        search
      }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const discoverGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH(`/v1/groups/discover`, {
      token,
      params: {
        limit: 10
      }
    }).then(async r => {
      resolve(r);
    });
  });
};

export const getGroupResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`/v1/groups/${group_id}`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const getJoinedGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH(`/v1/me/groups`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const getOwnedGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH(`/v1/me/groups/owner`, { token }).then(async r => {
      resolve(r);
    });
  });
};

export const getAdminGroupsResource = ({ token }) => {
  return new Promise(resolve => {
    FETCH(`/v1/me/groups/admin`, { token }).then(async r => {
      resolve(r);
    });
  });
};

// ██╗███╗   ██╗██╗   ██╗██╗████████╗███████╗
// ██║████╗  ██║██║   ██║██║╚══██╔══╝██╔════╝
// ██║██╔██╗ ██║██║   ██║██║   ██║   █████╗
// ██║██║╚██╗██║╚██╗ ██╔╝██║   ██║   ██╔══╝
// ██║██║ ╚████║ ╚████╔╝ ██║   ██║   ███████╗
// ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝   ╚═╝   ╚══════╝

export const generateShareTokenResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/token/generate`, { token }).then(
      async r => {
        resolve(r);
      }
    );
  });
};

export const setShareTokenResource = ({ token, tokenName, group_id }) => {
  console.log("token name", tokenName);
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/token/set`, {
      token,
      json: true,
      body: JSON.stringify({
        token: tokenName
      })
    }).then(async r => {
      resolve(r);
    });
  });
};

export const destroyShareTokenResource = ({ token, group_id }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/${group_id}/token/remove`, { token }).then(
      async r => {
        resolve(r);
      }
    );
  });
};

export const joinPrivateGroupWithTokenResource = ({ token, shareToken }) => {
  return new Promise(resolve => {
    FETCH(`POST /v1/groups/token/${shareToken}/join`, { token }).then(
      async r => {
        resolve(r);
      }
    );
  });
};
