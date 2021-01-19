import {call, put, select, takeEvery} from "redux-saga/effects";

import {generateColor, isMockDev} from "../utils/utils";
import devMessages, {addMockMessage} from "../dev_data/messages";
import {
  LOAD_GENERAL_MESSAGES,
  loadGeneralMessages,
  RENDER_GENERAL_MESSAGES,
  RENDER_MESSAGE,
  SEND_MESSAGE,
  WS_RECEIVED_MESSAGE
} from "../actions/roomActions";
import {get, post} from "./sagas";

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
        username: msg.username,
        time: msg.datetime,
        text: msg.text,
      }));
  }

  yield put({ type: RENDER_GENERAL_MESSAGES, messageList });
}

export function* loadGeneralMessagesSaga() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendMessageReq(action) {
  const userProfile = yield select(store => store.authReducer.userProfile)

  if (isMockDev()) {
    addMockMessage(userProfile.username, userProfile.color, action.text);
    yield put(loadGeneralMessages());
  } else {
    yield call(post, {
      url: '/sendRoomMessage',
      body: {
        text: action.text
      },
      username: userProfile.username
    })
  }
}

export function* doMessageSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessageReq);
}

export function* wsReceivedMessage(action) {
  yield put({ type: RENDER_MESSAGE, message: action.message });
}

export function* wsHandleReceivedMessageSaga() {
  yield takeEvery(WS_RECEIVED_MESSAGE, wsReceivedMessage);
}