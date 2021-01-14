import { ADD_TODO } from '../actions';
import { RENDER_TODO_LIST, RENDER_GENERAL_MESSAGES
} from '../actions';


const initialState = {
  toDoList: [],
  messageList: [],
};

export default function chatApp(state = initialState, action) {
  switch (action.type) {
    case RENDER_TODO_LIST:
      return {
        ...state,
        toDoList: action.toDoList
      };

    case ADD_TODO:
      let newToDoList = [
        ...state.toDoList,
        {
          ...action.toDoItem
        }
      ];
      return {
        ...state,
        toDoList: newToDoList
      };

    case RENDER_GENERAL_MESSAGES:
      return {
        ...state,
        messageList: action.messageList
      };

    default:
      return state;
  }
}