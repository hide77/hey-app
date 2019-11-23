import { Alert, Platform, Clipboard } from "react-native";
import ActionSheet from "react-native-action-sheet";

export const myContextMenu = ({e, message, deleteChatMessage, replyToUser}) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: ["Reply", "Copy", "Delete", "Cancel"],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
      title: "Hey",
      message: "What do you want to do now?"
    },
    buttonId => {
      if (buttonId === 0) replyToUser();
      if (buttonId === 1) Clipboard.setString(message.message);
      if (buttonId === 2) deleteChatMessage(message._id);
    }
  );
};

export const othersContextMenu = ({
  e,
  message,
  push,
  reportPost,
  reportUser,
  blockUser,
  replyToUser,
  userName,
  item
}) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: ["Reply", `${userName}'s Profile`, "Copy", "More", "Cancel"],
      cancelButtonIndex: 4,
      title: "Hey",
      message: "What do you want to do now?"
    },
    buttonId => {
      if (buttonId === 0) replyToUser();
      if (buttonId === 1) push("User", { id: message.user._id });
      if (buttonId === 2) Clipboard.setString(message.message);
      if (buttonId === 3) {
        moreContextMenu({ message, reportPost, reportUser, blockUser });
      }
    }
  );
};

const moreContextMenu = ({ message, reportPost, reportUser, blockUser }) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: ["Report message", "Report user", "Block user", "Cancel"],
      cancelButtonIndex: 3,
      title: "More",
      message: "What do you want to do?"
    },
    buttonId => {
      if (buttonId === 0) {
        reportTypeContextMenu(
          reportPost,
          message._id,
          blockUser,
          message.user._id
        );
      }
      if (buttonId === 1) {
        reportUser(message.user._id);
        reportUserContextMenu(blockUser, message.user._id);
      }
      if (buttonId === 2) {
        blockUser(message.user._id);
        Alert.alert(
          "User blocked",
          "You will no longer see this user's content. We are sorry for the inconvenience."
        );
      }
    }
  );
};

const reportTypeContextMenu = (reportPost, messageId, blockUser, userId) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: [
        "Spam",
        "Griefing/Trolling",
        "Violence",
        "Pornography",
        "Child Abuse",
        "Copyright",
        "Other",
        "Cancel"
      ],
      cancelButtonIndex: 7,
      title: "Report type",
      message: "Why are you reporting this comment?"
    },
    buttonId => {
      if (buttonId < 7) {
        reportPost(messageId, buttonId);
        Alert.alert(
          "Block user",
          "Your report has been submitted, we will shortly look into it. We are sorry for the inconvenience and thank you for taking the time to report. Do you also want to block this user?",
          [
            {
              text: "No",
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => blockUser(userId)
            }
          ]
        );
      }
    }
  );
};

const reportUserContextMenu = (blockUser, userId) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: ["Also block user", "Cancel"],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      title: "User reported",
      message: "Do you also want to block this user?"
    },
    buttonId => {
      if (buttonId === 0) {
        // Action #4
        blockUser(userId);
        Alert.alert(
          "User blocked",
          "You will no longer see this user's content. We are sorry for the inconvenience."
        );
      }
    }
  );
};
