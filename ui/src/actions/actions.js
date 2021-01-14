export const ADD_TODO = 'ADD_TODO';
export const LOAD_TODO_LIST = 'LOAD_TODO_LIST';
export const RENDER_TODO_LIST = 'RENDER_TODO_LIST';

export const LOAD_GENERAL_MESSAGES = 'LOAD_GENERAL_MESSAGES';
export const RENDER_GENERAL_MESSAGES = 'RENDER_GENERAL_MESSAGES';
export const LOGIN_REQ = 'LOGIN_REQ';
export const LOGIN_RESP = 'LOGIN_RESP';

export function addToDo(title) {
  return {
    type: ADD_TODO,
    toDoItem: {
      _id: (new Date().getTime()),
      title
    }
  };
}

export function loadToDoList() {
  return {
    type: LOAD_TODO_LIST
  };
}

export function doLogin(username) {
  console.log('action doLogin: ' + username);

  return {
    type: LOGIN_REQ,
    username: username
  };
}

export function loadGeneralMessages() {
  return {
    type: LOAD_GENERAL_MESSAGES
  };
}