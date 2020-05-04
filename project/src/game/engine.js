import { Square, Result } from './models';
import { Content, ResultState, State } from './constants';
import { cartesianMap } from './tools';
import UI from './ui';
import Timer from './timer';

class Engine {
  constructor( settings, endGameCallback ) {
    this.settings = settings;
    this.result = new Result();
    this.squares = [];

    this.endGameCallback = endGameCallback;

    Timer.reset();
    Timer.start();

    this.createSquares();
    this.setupMines();
    this.setupHints();

    this.emptySquaresCount = ( settings.width * settings.height ) - settings.minesTotal;

    this.timerInterval = setInterval( () => UI.updateTimer( Timer.format() ), 500 );

    UI.createField( settings, this );
    UI.updateFlagsCount( settings.minesTotal );
  }

  /**
   * returns a square at x-y position
   */
  getSquare( x, y ) {
    return this.squares.find( s => s.x === x && s.y === y );
  }

  /**
   * returns a random square in the collection
   */
  getRandomSquare() {
    const x = Math.floor( Math.random() * ( this.settings.width - 1 ) );
    const y = Math.floor( Math.random() * ( this.settings.height - 1 ) );
    return this.getSquare( x, y );
  }

  pauseGame() {
    Timer.stop();
  }

  resumeGame() {
    Timer.start();
  }

  /**
   * add indicators to around all mines
   */
  setupHints() {
    this.squares
      .filter( s => s.isContentMine )
      .forEach( s =>
        cartesianMap( s.x - 1, s.x + 2, s.y - 1, s.y + 2, ( x, y ) => {
          const square = this.getSquare( x, y );
          if ( square && !square.isContentMine ) {
            square.content = square.content + 1;
          }
        } )
      );
  }

  /**
   * put all mines on the game
   */
  setupMines() {
    let mines = this.settings.minesTotal;
    while ( mines > 0 ) {
      const square = this.getRandomSquare();
      if ( !square.isContentMine ) {
        square.content = Content.MINE;
        mines--;
      }
    }
  }

  /**
   * create an array with squares
   */
  createSquares() {
    this.squares = [];
    for ( let x = 0; x < this.settings.width; x++ ) {
      for ( let y = 0; y < this.settings.height; y++ ) {
        this.squares.push( new Square( x, y ) );
      }
    }
  }

  /**
   * reveal the mines to player, used on lose
   */
  revealMines() {
    this.squares.filter( s => s.isContentMine && s.isStateReady ).forEach( s => {
      s.state = State.DONE;
      UI.openSquare( s.x, s.y, s.content, true );
    } );
  }

  /**
  * tests whether win conditions were achieved
  */
  testWin() {
    const eachMineMarked = this.squares.filter( s => s.isContentMine ).every( s => s.isStateMarked );
    const onlyMinesMarked = this.squares.filter( s => s.isStateMarked ).length === this.settings.minesTotal;
    const allRevelead = this.squares.filter( s => s.isStateDone ).length === this.emptySquaresCount;
    if ( ( eachMineMarked && onlyMinesMarked ) || allRevelead ) {
      this.endGame( ResultState.WIN );
    }
  }

  /**
   * this will propagate the open of all empty fields physically linked to an empty field clicked.
   */
  emptyPropagation( x, y ) {
    cartesianMap( x - 1, x + 2, y - 1, y + 2, ( i, j ) => {
      if ( x === i && y === j ) { return; }

      const square = this.getSquare( i, j );
      if ( square && square.isStateReady && !square.isContentMine ) {
        square.state = State.DONE;
        UI.openSquare( i, j, square.content );
        if ( square.isEmpty ) {
          this.emptyPropagation( i, j );
        }
      }
    } );
  }

  /**
   * Triggers the end of the game
   */
  endGame( state ) {
    clearInterval( this.timerInterval );
    Timer.stop();
    const openSquares = this.squares.filter( s => s.isStateDone ).length;
    const boardSize = this.settings.width * this.settings.height;
    this.result.openSquares = openSquares;
    this.result.openSquaresPercent = ( openSquares / ( boardSize - this.settings.minesTotal ) ) * 100;
    this.result.minesLeft = this.squares.filter( s => !s.isStateMarked && s.content === Content.MINE ).length;
    this.result.state = state;
    this.result.formattedTime = Timer.format();
    Timer.reset();
    UI.endGame();
    this.revealMines();
    this.endGameCallback( this.result );
  }

  lClick( x, y ) {
    this.result.clicks++;
    const s = this.getSquare( x, y );
    if ( !s.isStateReady ) { return; }


    s.state = State.DONE;
    UI.openSquare( x, y, s.content );
    if ( s.isContentMine ) {
      this.endGame( ResultState.LOSE );
      return;
    }

    if ( s.content === Content.NOTHING ) {
      this.emptyPropagation( x, y );
    }
    this.testWin();
  }

  rClick( x, y ) {
    this.result.clicks++;
    const s = this.getSquare( x, y );
    if ( s.isStateReady ) {
      s.state = State.MARKED;
      UI.markSquare( x, y );
      this.testWin();
    } else if ( s.isStateMarked ) {
      s.state = State.DOUBT;
      UI.setDoubtSquare( x, y );
    } else if ( s.isStateDoubt ) {
      s.state = State.READY;
      UI.setPristineSquare( x, y );
    }

    const markedCount = this.squares.filter( s => s.isStateMarked ).length;
    UI.updateFlagsCount( this.settings.minesTotal - markedCount );
  }

  dropBomb( x, y ) {
    this.result.clicks++;
    const s = this.settings.bombSize;

    cartesianMap( x - s, x + s + 1, y - s, y + s + 1, ( i, j ) => {
      const s = this.getSquare( i, j );
      if ( !s ) { return; }
      if ( s.isContentMine ) {
        s.state = State.MARKED;
        UI.markSquare( i, j );
      } else {
        s.state = State.DONE;
        UI.openSquare( i, j, s.content );
        if ( s.content === Content.NOTHING ) {
          this.emptyPropagation( i, j );
        }
      }
    } );

    this.testWin();

    const markedCount = this.squares.filter( s => s.isStateMarked ).length;
    UI.updateFlagsCount( this.settings.minesTotal - markedCount );
  }
}

export default Engine;
