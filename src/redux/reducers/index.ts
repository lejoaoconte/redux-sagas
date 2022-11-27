import { combineReducers } from "redux";

import { loadingBarReducer } from "react-redux-loading-bar";

import { userReducer } from "./user";

const rootReucer = combineReducers({
  user: userReducer,
  loadingBar: loadingBarReducer,
});

export default rootReucer;
