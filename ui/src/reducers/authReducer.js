import {LOGIN_RESP, LOGOUT, RELOAD_USER} from "../actions/authActions";

const initialState = {
  userProfile: {
    "loggedIn": false,
    "username": '',
    "color": ''
  }
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_RESP:
      return {
        ...state,
        userProfile: action.userProfile
      };

    case RELOAD_USER:
      return {
        ...state,
        userProfile: action.loadedProfile
      };

    case LOGOUT:
      return {
        ...state,
        userProfile: initialState.userProfile
      };

    default:
      return state
  }
}