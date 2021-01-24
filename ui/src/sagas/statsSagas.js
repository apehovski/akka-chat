import {put, select, takeEvery} from "redux-saga/effects";
import {
  RENDER_FULL_STATS,
  RENDER_STATS_UPDATE,
  REPLACE_STATS_UPDATE,
  WS_FULL_STATS,
  WS_STATS_UPDATE
} from "../actions/statsActions";

export function* wsReceivedFullStats(action) {
  yield put({ type: RENDER_FULL_STATS, fullStats: action.fullStats });
}

export function* wsFullStatsSaga() {
  yield takeEvery(WS_FULL_STATS, wsReceivedFullStats);
}

export function* wsReceivedStatsUpdate(action) {
  const currStats = yield select(store => store.statsReducer.stats)

  if (currStats.length === 5) {
    yield put({ type: REPLACE_STATS_UPDATE, statsUpdate: action.statsUpdate })
  } else {
    yield put({ type: RENDER_STATS_UPDATE, statsUpdate: action.statsUpdate })
  }
}

export function* wsStatsUpdateSaga() {
  yield takeEvery(WS_STATS_UPDATE, wsReceivedStatsUpdate);
}