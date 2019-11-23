import React from "react";
import { pop, push } from "hey-screens/navigation";
import { View, Text, ScrollView } from "react-native";
import { Wrapper } from "hey-components/Common";
import { withTheme } from "hey-theme";
import LikedByModal from "hey-screens/Modals/LikedByModal";
import UsersListModal from "hey-screens/Modals/UsersListModal";
import HashtagHistory from "hey-screens/Modals/HashtagHistoryModal";

class Modal extends React.Component {
  render() {
    console.log("modal opened");
    const { theme } = this.props;
    const { title = "List", payload, parentComponent } = this.props.stateParams;
    console.log("props", this.props);
    switch (this.props.stateParams.type) {
      case "UserList":
        return (
          <UsersListModal
            appTheme={theme}
            title={title}
            payload={this.props.stateParams.payload}
            close={() => {
              pop(this.props.componentId);
            }}
          />
        );
      case "HashtagHistory":
        return (
          <HashtagHistory
            appTheme={theme}
            title={title}
            payload={this.props.stateParams.payload}
            close={() => {
              pop(this.props.componentId);
            }}
          />
        );
    }
  }
}
export default withTheme(Modal);
