import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  LOAD_TODO_LIST, RENDER_TODO_LIST,
  LOAD_GENERAL_MESSAGES, RENDER_GENERAL_MESSAGES
} from '../actions';

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
  const data = [msgData1, msgData2, msgData3]
  yield put({ type: RENDER_GENERAL_MESSAGES, messageList: data });
}

export function* loadGeneralMessages() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}


//TODO try `async-await` way?
//https://stackoverflow.com/questions/43443620/redux-saga-async-await-pattern
export default function* rootSaga() {
  yield all([loadToDoList(), loadGeneralMessages()]);
}

function generateColor() {
  return Math.floor(Math.random()*16777215).toString(16);
}

//test data
const msgData1 = {
  color: '#' + generateColor(),
  username: 'User First',
  time: '19:47',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData2 = {
  color: '#' + generateColor(),
  username: 'User Second',
  time: '19:49',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
const msgData3 = {
  color: '#' + generateColor(),
  username: 'User Third',
  time: '19:52',
  text: 'Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message Some text message ',
};
