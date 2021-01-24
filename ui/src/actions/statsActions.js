export const WS_FULL_STATS = 'WS_FULL_STATS';
export const RENDER_FULL_STATS = 'RENDER_FULL_STATS';
export const WS_STATS_UPDATE = 'WS_STATS_UPDATE';
export const RENDER_STATS_UPDATE = 'RENDER_STATS_UPDATE';
export const REPLACE_STATS_UPDATE = 'REPLACE_STATS_UPDATE';

export function wsFullStats(fullStats) {
  return {
    type: WS_FULL_STATS,
    fullStats
  };
}

export function wsStatsUpdate(statsUpdate) {
  return {
    type: WS_STATS_UPDATE,
    statsUpdate
  };
}