import {RENDER_GENERAL_MESSAGES, RENDER_MESSAGE} from "../actions/roomActions";
import {formatMessageDate} from "../utils/utils";

const initialState = {
  messageList: [],
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case RENDER_MESSAGE: {
      const newMessage = {
        color: action.userProfile.color,
        username: action.userProfile.username,
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
