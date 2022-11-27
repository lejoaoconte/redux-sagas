import { combineReducers } from "redux";
import { userReducer } from "./user";

const rootReucer = combineReducers({
  user: userReducer,
});

export default rootReucer;
