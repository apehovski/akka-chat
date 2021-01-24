import {RENDER_FULL_STATS, RENDER_STATS_UPDATE, REPLACE_STATS_UPDATE} from "../actions/statsActions";
import {LOGOUT_RESP} from "../actions/authActions";

const initialState = {
  stats: []
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case RENDER_FULL_STATS: {
      action.fullStats.sort((a, b) => b.count - a.count);

      return {
        ...state,
        stats: action.fullStats
      };
    }

    case RENDER_STATS_UPDATE: {
      let updStatsList = [
        ...state.stats,
        {
          ...action.statsUpdate
        }
      ];
      updStatsList.sort((a, b) => b.count - a.count);

      return {
        ...state,
        stats: updStatsList
      };
    }

    case REPLACE_STATS_UPDATE: {
      let updStatsList = Object.assign([], state.stats)
      updStatsList.splice(updStatsList.length - 1, 1)
      updStatsList.push(action.statsUpdate)
      updStatsList.sort((a, b) => b.count - a.count);

      return {
        ...state,
        stats: updStatsList
      };
    }

    case LOGOUT_RESP:
      return {
        ...state,
        stats: initialState.stats
      };

    default:
      return state
  }
}