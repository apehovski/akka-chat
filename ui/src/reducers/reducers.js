import {ADD_TODO, LOGIN_RESP, LOGOUT, RELOAD_USER, RENDER_GENERAL_MESSAGES, RENDER_TODO_LIST} from '../actions/actions';


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