import {combineReducers} from "redux";
import authReducer from "./authReducer";
import roomReducer from "./roomReducer";
import statsReducer from "./statsReducer";

export default combineReducers({
  authReducer,
  roomReducer,
  statsReducer
})