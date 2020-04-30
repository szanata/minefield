/**
 * state constants
 */
const State = {
  READY: 0,
  DONE: 1,
  DOUBT: 2, //is a tagged as a doubt
  MARKED: 3 //marked as mine!!!
};

/**
 * content constants
 */
const Content = {
  MINE: -1,
  NOTHING: 0,
  NEAR_1 : 1,
  NEAR_2 : 2,
  NEAR_3 : 3,
  NEAR_4 : 4,
  NEAR_5 : 5,
  NEAR_6 : 6,
  NEAR_7 : 7,
  NEAR_8 : 8
};

const GameDifficulty = {
  KIDS_PLAY: 'kids-play',
  MEDIUM: 'medium',
  INSANE: 'insane',
  CUSTOM: 'custom'
};

const ResultState = {
  WIN: 0,
  LOSE: 1
};

export {
  Content,
  State,
  GameDifficulty,
  ResultState
};
