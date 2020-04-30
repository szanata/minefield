import { Content, State, ResultState } from './constants';

/**
 * Square class
 */
class Square {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
    this.content = Content.NOTHING;
    this.state = State.READY;
  }

  get isStateReady() { return this.state === State.READY; }
  get isStateDone() { return this.state === State.DONE; }
  get isStateMarked() { return this.state === State.MARKED; }
  get isStateDoubt() { return this.state === State.DOUBT; }
  get isContentMine() { return this.content === Content.MINE; }
  get isEmpty() { return this.content === Content.NOTHING; }
}

class GameSettings {
  constructor( width, height, minesTotal ) {
    this.width = width;
    this.height = height;
    this.minesTotal = minesTotal;
    this.bombs = 1;
    this.bombSize = Math.floor( this.width / 10 );
  }
}

class Result {
  constructor() {
    this.state = null;
    this.squaresRevealed = 0;
    this.squaresRevealedPercent = 0;
    this.minesLeft = 0;
    this.formattedTime = null;
    this.clicks = 0;
  }

  get isWin() { return this.state === ResultState.WIN; }
}

export {
  GameSettings,
  Result,
  Square
};
