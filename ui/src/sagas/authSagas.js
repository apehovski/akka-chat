import {call, put, select, takeEvery} from "redux-saga/effects";

import {isMockDev} from "../utils/utils";
import * as auth from "../utils/authLocalStorage";
import {LOGIN_REQ, LOGIN_RESP, LOGOUT_REQ, LOGOUT_RESP} from "../actions/authActions";
import {post} from "./sagas";

export function* sendLoginReq(action) {
  let userProfile = {};
  if (isMockDev()) {
    userProfile.loggedIn = true;
    userProfile.username = action.username;
  } else {
    userProfile = yield call(post, {
      url: '/login',
      body: {
        username: action.username
      }
    })
  }

  yield auth.logIn(userProfile);
  yield put({ type: LOGIN_RESP, userProfile });
}

export function* doLoginSaga() {
  yield takeEvery(LOGIN_REQ, sendLoginReq);
}

export function* sendLogoutReq(action) {
  const username = yield select(store => store.authReducer.userProfile.username)

  yield auth.logOut();
  yield put({ type: LOGOUT_RESP });

  if (!isMockDev()) {
    yield call(post, {
      url: '/logout',
      username
    })
  }
}

export function* doLogoutSaga() {
  yield takeEvery(LOGOUT_REQ, sendLogoutReq);
}