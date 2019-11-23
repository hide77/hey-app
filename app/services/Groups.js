// import React from "react";
import { Share, Clipboard } from "react-native";
import ActionSheet from "react-native-action-sheet";
import { EXTERNAL_SHARE_LINK } from "hey-mocks/types";
import { idx } from "hey-mocks/helper";

const inviteLink = (shareToken, privateGroup) =>
  `${EXTERNAL_SHARE_LINK}${shareToken}`;

export const adminInvite = ({
  group,
  generateShareToken,
  destroyShareToken,
  hideDialog
}) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: [
        "Copy",
        "Share...",
        "Regenerate",
        "Rename",
        "Destroy",
        "Cancel"
      ],
      destructiveButtonIndex: 4,
      cancelButtonIndex: 5,
      title: "Invite Link",
      message: "What do you want to do?"
    },
    buttonId => {
      if (buttonId === 0) {
        Clipboard.setString(inviteLink(group.token, group.private));
      }
      if (buttonId === 1) {
        Share.share({
          title: `Invitation from ${idx(["owner", "username"], group)}`,
          message: `👋 Hey! join « ${group.name} »! ${inviteLink(
            group.token,
            group.private
          )}`
        });
      }
      if (buttonId === 2) {
        generateShareToken({
          group_id: group._id,
          cb: r => {
            console.log("generated", r);
          }
        });
      }
      if (buttonId === 3) {
        hideDialog();
        // this.setState({ isSetTokenDialogVisible: true });
      }
      if (buttonId === 4) {
        destroyShareToken({
          group_id: group._id,
          cb: r => {
            console.log("generated", r);
          }
        });
      }
    }
  );
};

export const userInvite = ({ group, generateShareToken }) => {
  const _continue = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ["Copy", "Share...", "Cancel"],
        cancelButtonIndex: 2,
        title: "Invite Link",
        message: "What do you want to do?"
      },
      buttonId => {
        if (buttonId === 0) {
          Clipboard.setString(inviteLink(group.token, group.private));
        }
        if (buttonId === 1) {
          Share.share({
            title: `Invitation from ${idx(["owner", "username"], group)}`,
            message: `👋 Hey! join « ${group.name} »! ${inviteLink(
              group.token,
              group.private
            )}`
          });
        }
      }
    );
  };
  if (group.is_owner && !group.token) {
    generateShareToken({
      group_id: group._id,
      cb: r => {
        console.log("generated", r);
        _continue();
      }
    });
  } else {
    _continue();
  }
};
