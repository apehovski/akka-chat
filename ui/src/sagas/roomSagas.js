import {put, takeEvery} from "redux-saga/effects";

import {isMockDev} from "../utils/utils";
import devMessages from "../dev_data/messages";
import {LOAD_GENERAL_MESSAGES, RENDER_GENERAL_MESSAGES, RENDER_MESSAGE, SEND_MESSAGE} from "../actions/roomActions";

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
  yield put({
    type: RENDER_MESSAGE,
    userProfile: action.userProfile,
    text: action.text
  });
}

export function* doMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessageReq);
}