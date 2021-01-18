import {call, put, takeEvery} from "redux-saga/effects";

import {generateColor, isMockDev} from "../utils/utils";
import devLogin from "../dev_data/login";
import * as auth from "../utils/authLocalStorage";
import {LOGIN_REQ, LOGIN_RESP} from "../actions/authActions";
import {post} from "./sagas";

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
  yield put({ type: LOGIN_RESP, userProfile });
}

export function* doLoginSaga() {
  yield takeEvery(LOGIN_REQ, sendLoginReq);
}
