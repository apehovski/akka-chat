import {all, call, put, takeEvery} from 'redux-saga/effects';
import {
  LOAD_GENERAL_MESSAGES,
  LOAD_TODO_LIST,
  LOGIN_REQ,
  LOGIN_RESP,
  RENDER_GENERAL_MESSAGES,
  RENDER_TODO_LIST
} from '../actions/actions';

import {isLocalDev} from '../utils/utils';
import devMessages from '../dev_data/messages';

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
  let data = [];
  if (isLocalDev()) {
    data = devMessages;
  }

  yield put({ type: RENDER_GENERAL_MESSAGES, messageList: data });
}

export function* loadGeneralMessages() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendLoginReqS() {
  console.log('saga sendLoginReqS')
  if (isLocalDev()) {
    // var mydata = JSON.parse("../dev_data/");
  }
  // const endpoint = 'http://localhost:9000/api/login/testname';
  // const response = yield call(fetch, endpoint);
  // const respData = yield response.json();
  // console.log('SAGA: ' + JSON.stringify(respData))

  // yield put({ type: RENDER_TODO_LIST, toDoList: data });

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