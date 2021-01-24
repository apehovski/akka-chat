import statsReducer from './statsReducer'
import mockStats from "../dev_data/stats";

describe('Test statsReducer', () => {
  it('should load full stats and sort', () => {
    const initialState = {stats: []}
    const state = statsReducer(initialState, {type: "RENDER_FULL_STATS", fullStats: mockStats})

    expect(state.stats).toHaveLength(5)
    expect(state.stats).toEqual(expect.arrayContaining(mockStats))
    expect(mockStats[0].count).toEqual(15);
    expect(state.stats[0].count).toEqual(35);
  });

  it('should do update and sort', () => {
    const initialState = {stats: [{word: 'test-word', count: 3}]}
    expect(initialState.stats[0].count).toEqual(3)

    const state = statsReducer(initialState, {type: "RENDER_STATS_UPDATE", statsUpdate: mockStats[0]})

    expect(state.stats).toHaveLength(2)
    expect(state.stats[0].count).toEqual(15);
    expect(state.stats[1].count).toEqual(3);
  });

  it('should do replace and sort', () => {
    const initialState = {stats: []}

    //load full
    const preState = statsReducer(initialState, {type: "RENDER_FULL_STATS", fullStats: mockStats})
    expect(preState.stats).toHaveLength(5)
    expect(preState.stats[0].count).toEqual(35)

    //do update
    const newValue = {word: 'test-word', count: 125}
    const postState = statsReducer(preState, {type: "REPLACE_STATS_UPDATE", statsUpdate: newValue})

    expect(postState.stats).toHaveLength(5)
    expect(postState.stats[0].count).toEqual(125);
    expect(postState.stats[1].count).toEqual(35);
  });

});