import {call, put, select, takeEvery} from "redux-saga/effects";

import {isMockDev} from "../utils/utils";
import {generateAllColors, getColor} from "../utils/colorStorage";
import mockMessages, {addMockMessage} from "../dev_data/messages";
import mockStats from "../dev_data/stats";
import {
  LOAD_GENERAL_MESSAGES,
  loadGeneralMessages,
  RENDER_GENERAL_MESSAGES,
  RENDER_MESSAGE,
  SEND_MESSAGE,
  WS_NEW_MESSAGE
} from "../actions/roomActions";
import {get, post} from "./sagas";
import {wsFullStats} from "../actions/statsActions";



export function* fetchGeneralMessages() {
  let messageList = [];
  if (isMockDev()) {
    messageList = Object.assign([], mockMessages)
    if (!getColor(mockMessages[0].username)) {
      generateAllColors(messageList);
    }
    yield put(wsFullStats(mockStats));

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

export function* wsReceivedNewMessage(action) {
  yield put({ type: RENDER_MESSAGE, message: action.message });
}

export function* wsNewMessageSaga() {
  yield takeEvery(WS_NEW_MESSAGE, wsReceivedNewMessage);
}