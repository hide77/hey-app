import React from 'react';
import {TouchableOpacity} from 'react-native';

export default class TouchableMulti extends React.Component {
  static defaultProps = {
    delay: 1000,
    onDoubleTap: () => null,
  };

  lastTap = null;

  handleDoubleTap = () => {
    const now = Date.now();
    if (this.lastTap && now - this.lastTap < this.props.delay) {
      // console.log('double tap')
      this.props.onDoubleTap();
    } else {
      // console.log('simple tap')
      this.lastTap = now;
    }
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.handleDoubleTap}
        onLongPress={this.props.onLongPress}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
