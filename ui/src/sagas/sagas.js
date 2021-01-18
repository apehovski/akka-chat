import {all, call, put, takeEvery} from 'redux-saga/effects';

import {
  LOAD_GENERAL_MESSAGES,
  LOAD_TODO_LIST,
  LOGIN_REQ,
  LOGIN_RESP,
  RENDER_GENERAL_MESSAGES,
  RENDER_MESSAGE,
  RENDER_TODO_LIST,
  SEND_MESSAGE
} from '../actions/actions';

import devMessages from '../dev_data/messages';
import devLogin from '../dev_data/login';
import {isMockDev, config, generateColor} from '../utils/utils';
import * as auth from "../utils/authLocalStorage";

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
  if (isMockDev()) {
    data = devMessages;
  }

  yield put({ type: RENDER_GENERAL_MESSAGES, messageList: data });
}

export function* loadGeneralMessagesSaga() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendLoginReq(action) {
  let userProfile;
  if (isMockDev()) {
    userProfile = devLogin;
    userProfile.username = action.username;
    userProfile.color = '#bbb';
  } else {
    userProfile = yield call(post, {
      url: '/login',
      body: {
        username: action.username
      }
    })
    userProfile.color = yield generateColor();
  }

  yield auth.logIn(userProfile);
  yield put({ type: LOGIN_RESP, userProfile: userProfile });
}

export function* doLoginSaga() {
  yield takeEvery(LOGIN_REQ, sendLoginReq);
}

export function* sendMessageReq(action) {
  //do server req
  yield put({ type: RENDER_MESSAGE, text: action.text });
}

export function* doMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessageReq);
}

export default function* rootSaga() {
  yield all([
    loadToDoList(), loadGeneralMessagesSaga(), doLoginSaga(), doMessageSaga()
  ]);
}

function post({url, body}) {
  return fetch(config.API + url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    return response.json();
  })
}