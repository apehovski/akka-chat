import {all, put, takeEvery} from 'redux-saga/effects';

import {LOAD_GENERAL_MESSAGES, RENDER_GENERAL_MESSAGES, RENDER_MESSAGE, SEND_MESSAGE} from '../actions/actions';

import devMessages from '../dev_data/messages';
import {config, isMockDev} from '../utils/utils';
import {doLoginSaga} from "./authSagas";

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

export function* sendMessageReq(action) {
  //do server req
  yield put({ type: RENDER_MESSAGE, text: action.text });
}

export function* doMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessageReq);
}

export default function* rootSaga() {
  yield all([
    loadGeneralMessagesSaga(), doLoginSaga(), doMessageSaga()
  ]);
}

export async function post({url, body}) {
  const response = await fetch(config.API + url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return await response.json();
}