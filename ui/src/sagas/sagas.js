import {all} from 'redux-saga/effects';

import {config} from '../utils/utils';
import {doLoginSaga, doLogoutSaga} from "./authSagas";
import {doMessageSaga, loadGeneralMessagesSaga} from "./roomSagas";

export default function* rootSaga() {
  yield all([
    doLoginSaga(), doLogoutSaga(),
    loadGeneralMessagesSaga(), doMessageSaga()
  ]);
}

export async function post({url, body, username}) {
  const headers = new Headers();
  headers.append('Accept', '*/*')
  headers.append('Content-Type', 'application/json')
  addBasicAuth(headers, username);

  const response = await fetch(config.API + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  return await response.json();
}

export async function get({url, username}) {
  const headers = new Headers();
  headers.append('Accept', '*/*')
  addBasicAuth(headers, username);

  const response = await fetch(config.API + url, {
    method: 'GET',
    headers
  });

  return await response.json();
}

function addBasicAuth(headers, username) {
  if (username !== undefined) {
    const encoded = btoa(unescape(encodeURIComponent(username + ':' + username)));
    headers.append('Authorization', 'Basic ' + encoded);
  }
}