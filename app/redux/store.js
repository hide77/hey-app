import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "remote-redux-devtools";
import thunk from "redux-thunk";
import rootReducer from "hey-redux/reducers";

export default createStore(
  rootReducer,
  applyMiddleware(thunk)
  // composeWithDevTools(applyMiddleware(thunk))
);
