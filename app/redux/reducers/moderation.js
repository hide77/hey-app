import {BLOCK_USER, REPORT_USER, REPORT_POST} from 'hey-redux/types/moderation';

export default (state, action) => {
  switch (action.type) {
    case BLOCK_USER:
      return Object.assign({}, state, action);
    case REPORT_USER:
      return Object.assign({}, state, action);
    case REPORT_POST:
      return Object.assign({}, state, action);
    default:
      return Object.assign({}, state, action);
  }
};
