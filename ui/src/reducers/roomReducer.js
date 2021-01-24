import {RENDER_GENERAL_MESSAGES, RENDER_MESSAGE} from "../actions/roomActions";
import {getColor} from "../utils/colorStorage";
import {LOGOUT_RESP} from "../actions/authActions";

const initialState = {
  messageList: [],
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case RENDER_GENERAL_MESSAGES:
      const coloredList = action.messageList
        .map(msg => {
          msg.color = getColor(msg.username);
          return msg;
        })

      return {
        ...state,
        messageList: coloredList
      };

    case RENDER_MESSAGE: {
      const newMessage = {
        color: getColor(action.message.username),
        username: action.message.username,
        time: action.message.datetime,
        text: action.message.text
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

    case LOGOUT_RESP:
      return {
        ...state,
        messageList: initialState.messageList
      }

    default:
      return state;
  }
}
