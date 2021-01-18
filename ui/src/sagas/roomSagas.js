import {call, put, takeEvery, select} from "redux-saga/effects";

import {generateColor, isMockDev} from "../utils/utils";
import devMessages from "../dev_data/messages";
import {LOAD_GENERAL_MESSAGES, RENDER_GENERAL_MESSAGES, RENDER_MESSAGE, SEND_MESSAGE} from "../actions/roomActions";
import {post, get} from "./sagas";

export function* fetchGeneralMessages() {
  let messageList = [];
  if (isMockDev()) {
    messageList = devMessages;
  } else {

    const username = yield select(store => store.authReducer.userProfile.username)
    messageList = yield call(get, {
      url: '/roomHistory',
      username
    })

    messageList = messageList.history
      .map(msg => ({
        color: generateColor(),
        username: msg[0],
        time: '20:06',
        text: msg[1],
      }));
  }

  yield put({ type: RENDER_GENERAL_MESSAGES, messageList });
}

export function* loadGeneralMessagesSaga() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendMessageReq(action) {
  //do server req
  //TODO select() from effects
  yield put({
    type: RENDER_MESSAGE,
    userProfile: action.userProfile,
    text: action.text
  });
}

export function* doMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessageReq);
}