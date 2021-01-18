import {all} from 'redux-saga/effects';

import {config} from '../utils/utils';
import {doLoginSaga} from "./authSagas";
import {doMessageSaga, loadGeneralMessagesSaga} from "./roomSagas";

export default function* rootSaga() {
  yield all([
    doLoginSaga(),
    loadGeneralMessagesSaga(), doMessageSaga()
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