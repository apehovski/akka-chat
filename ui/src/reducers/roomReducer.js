import {RENDER_GENERAL_MESSAGES, RENDER_MESSAGE} from "../actions/roomActions";
import {generateColor} from "../utils/utils";

const initialState = {
  messageList: [],
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case RENDER_GENERAL_MESSAGES:
      return {
        ...state,
        messageList: action.messageList
      };

    case RENDER_MESSAGE: {
      const newMessage = {
        color: generateColor(),
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

    default:
      return state;
  }
}
