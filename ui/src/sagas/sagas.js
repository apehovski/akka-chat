import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  LOAD_TODO_LIST, RENDER_TODO_LIST,
  LOAD_GENERAL_MESSAGES, RENDER_GENERAL_MESSAGES,
  LOGIN_REQ, LOGIN_RESP
} from '../actions/actions';

import { generateColor } from '../utils/utils';

export function* fetchToDoList() {
  const endpoint = 'https://gist.githubusercontent.com/brunokrebs/f1cacbacd53be83940e1e85860b6c65b/raw/to-do-items.json';
  const response = yield call(fetch, endpoint);
  const data = yield response.json();
  yield put({ type: RENDER_TODO_LIST, toDoList: data });
}

export function* loadToDoList() {
  yield takeEvery(LOAD_TODO_LIST, fetchToDoList);
}

export function* fetchGeneralMessages() {
  const data = [msgData1, msgData2, msgData3, msgData4, msgData5, msgData6, msgData7]
  yield put({ type: RENDER_GENERAL_MESSAGES, messageList: data });
}

export function* loadGeneralMessages() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendLoginReqS() {
  console.log('saga sendLoginReqS')
  // color: generateColor(),
  // username: action ? action.username : '',
  const data = {
    color: '#bbb',
    username: 'username'
  }
  yield put({ type: LOGIN_RESP, userProfile: data });
}

export function* doLoginS() {
  console.log('saga doLoginS')
  yield takeEvery(LOGIN_REQ, sendLoginReqS);
}


//TODO try `async-await` way?
//https://stackoverflow.com/questions/43443620/redux-saga-async-await-pattern

export default function* rootSaga() {
  yield all([
    loadToDoList(), loadGeneralMessages(), doLoginS()
  ]);
}


//test data
const msgData1 = {
  color: generateColor(),
  username: 'User First',
  time: '19:47',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData2 = {
  color: generateColor(),
  username: 'User Second',
  time: '19:49',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData3 = {
  color: generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData4 = {
  color: generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData5 = {
  color: generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData6 = {
  color: generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData7 = {
  color: generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
