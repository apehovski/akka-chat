import * as utils from "../utils/utils";
import {
  ADD_TODO, LOGIN_RESP, RENDER_GENERAL_MESSAGES, RENDER_TODO_LIST
} from '../actions/actions';


const initialState = {
  userProfile: {},
  toDoList: [],
  messageList: [],
};

export default function chatApp(state = initialState, action) {
  switch (action.type) {
    case LOGIN_RESP:
      utils.logIn();
      return {
        ...state,
        userProfile: action.userProfile
      };

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