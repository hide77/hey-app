import ActionSheet from "react-native-action-sheet";

export default _actionSheet => {
  let _actionSheetOptions = {
    options: [],
    title: _actionSheet.title,
    message: _actionSheet.message
  };
  let _actionSheetActions = [];

  _actionSheet.actions.map((e, key) => {
    if (!e.disabled) {
      if (e.cancelButton) {
        _actionSheetOptions.cancelButtonIndex = key;
      }
      if (e.destructiveButton) {
        _actionSheetOptions.destructiveButtonIndex = key;
      }
      _actionSheetOptions.options.push(e.title);
      _actionSheetActions.push(e.action);
    }
  });

  ActionSheet.showActionSheetWithOptions(_actionSheetOptions, buttonId => {
    if (typeof _actionSheetActions[buttonId] === "function") {
      _actionSheetActions[buttonId]();
    }
  });
};
