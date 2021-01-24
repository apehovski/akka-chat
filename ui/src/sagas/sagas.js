import {all} from 'redux-saga/effects';

import {config} from '../utils/utils';
import {doLoginSaga, doLogoutSaga} from "./authSagas";
import {doMessageSaga, loadGeneralMessagesSaga, wsNewMessageSaga,} from "./roomSagas";
import {wsFullStatsSaga, wsStatsUpdateSaga} from "./statsSagas";

export default function* rootSaga() {
  yield all([
    doLoginSaga(), doLogoutSaga(),
    loadGeneralMessagesSaga(), doMessageSaga(),
    wsNewMessageSaga(), wsFullStatsSaga(), wsStatsUpdateSaga()
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

  return await parseResponse(response);
}

export async function get({url, username}) {
  const headers = new Headers();
  headers.append('Accept', '*/*')
  addBasicAuth(headers, username);

  const response = await fetch(config.API + url, {
    method: 'GET',
    headers
  });

  return await parseResponse(response);
}

function addBasicAuth(headers, username) {
  if (username) {
    const encoded = btoa(unescape(encodeURIComponent(username + ':' + username)));
    headers.append('Authorization', 'Basic ' + encoded);
  }
}

async function parseResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(err);
    return text;
  }
}