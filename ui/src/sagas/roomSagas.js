import {call, put, select, takeEvery} from "redux-saga/effects";

import {isMockDev} from "../utils/utils";
import {getColor, generateAllColors} from "../utils/colorStorage";
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
    messageList = Object.assign([], devMessages)
    if (!getColor(devMessages[0].username)) {
      generateAllColors(messageList);
    }

  } else {
    const username = yield select(store => store.authReducer.userProfile.username)
    messageList = yield call(get, {
      url: '/roomHistory',
      username
    })

    messageList = messageList.history
      .map(msg => ({
        username: msg.username,
        time: msg.datetime,
        text: msg.text,
      }));

    generateAllColors(messageList);
  }

  yield put({ type: RENDER_GENERAL_MESSAGES, messageList });
}

export function* loadGeneralMessagesSaga() {
  yield takeEvery(LOAD_GENERAL_MESSAGES, fetchGeneralMessages);
}

export function* sendMessageReq(action) {
  const username = yield select(store => store.authReducer.userProfile.username)

  if (isMockDev()) {
    addMockMessage(username, action.text);
    yield put(loadGeneralMessages());
  } else {
    yield call(post, {
      url: '/sendRoomMessage',
      body: {
        text: action.text
      },
      username
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