import {RENDER_GENERAL_MESSAGES, RENDER_MESSAGE,} from '../actions/actions';
import {LOGIN_RESP, LOGOUT, RELOAD_USER} from "../actions/authActions";
import {formatMessageDate} from "../utils/utils";


const initialState = {
  userProfile: {
    "loggedIn": false,
    "username": '',
    "color": ''
  },
  toDoList: [],
  messageList: [],
};

export default function chatApp(state = initialState, action) {
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

    case RENDER_MESSAGE: {
      const newMessage = {
        color: state.userProfile.color,
        username: state.userProfile.username,
        time: formatMessageDate(new Date()),
        text: action.text
      }
      let updMessageList = [
        ...state.messageList,
        {
          ...newMessage
        }
      ];

      return {
        ...state,
        messageList: updMessageList
      };
    }

    case RENDER_GENERAL_MESSAGES:
      return {
        ...state,
        messageList: action.messageList
      };

    default:
      return state;
  }
}