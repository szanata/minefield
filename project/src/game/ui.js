import FX from './fx';
import Storage from './storage';
import { cartesianMap } from './tools';
import { Content } from './constants';

class UI {
  constructor() {
    this.active = false;
    this.paused = false;
    this.minHeight = 600;
    this.bombMode = false;
    this.bombsLeft = 0;
    this.bombSize = 0;
    this.mute = false;

    this.$timer = $( '#timer' );
    this.$flags = $( '#flags' );
    this.$muteBtn = $( '#mute' );
    this.$bombBtn = $( '#bomb' );
    this.$pauseBtn = $( '#pause' );
    this.$newGameBtn = $( '#new-game' );
    this.$startGame = $( '#start' );

    window.testMe = FX.playClick;
  }

  init( { newGameCallback } ) {
    if ( Storage.get( 'mute' ) === '1' ) {
      this._toggleMute();
    }

    this.$newGameBtn.on( 'click', e => {
      e.preventDefault();
      newGameCallback();
    } );

    this.$startGame.on( 'click', e => {
      e.preventDefault();
      $( '#start-wrapper' ).remove();
      newGameCallback();
    } );

    this.$muteBtn.on( 'click', e => {
      e.preventDefault();
      this._toggleMute();
    } );

    this.$bombBtn.on( 'click', e => {
      e.preventDefault();
      if ( !this.active ) { return; }
      if ( this.bombsLeft === 0 ) { return; }

      if ( this.bombMode ) {
        $( 'body' ).removeClass( 'bomb-mode' );
        this.bombMode = false;
        this._unsetBombTargeting();
      } else {
        $( 'body' ).addClass( 'bomb-mode' );
        this.bombMode = true;
        this._setBombTargeting();
      }
    } );

    // bind pause
    $( document ).bind( 'keypress.pause', e => {
      if ( !this.active ) { return; }
      if ( e.keyCode === 32 ) { //space
        e.preventDefault();
        this._togglePause();
      }
    } );
    this.$pauseBtn.on( 'click', e => {
      e.preventDefault();
      if ( !this.active ) { return; }
      this._togglePause();
    } );
  }

  _togglePause() {
    if ( this.paused ) {
      this.paused = false;
      this.engine.resumeGame();

      Lollipop.close( true );
      $( '#field' ).show();
    } else {
      this.paused = true;
      this.engine.pauseGame();

      $( '#field' ).hide();
      Lollipop.open( {
        showTitle: false,
        animate: true,
        minHeight: 50,
        content: '<h1>Waiting for you :)</h1><p><b>Pro tip</b>: use <i>spacebar</i> to pause/unpause game.</p>',
        showCancelButton: false,
        buttons: [ {
          title:'Resume',
          click() {
            this._togglePause();
          }
        } ]
      } );

    }
  }

  _toggleMute( ) {
    if ( this.mute ) {
      this.$muteBtn.removeClass( 'muted' );
      FX.unmute();
      Storage.set( 'mute', '0' );
      this.mute = false;
    } else {
      this.$muteBtn.addClass( 'muted' );
      FX.mute();
      Storage.set( 'mute', '1' );
      this.mute = true;
    }
  }

  _resizeSquares( w ) {
    $( '.square' ).css( {
      fontSize:( w / 2 ) + 'px',
      lineHeight:w + 'px',
      width:w + 'px',
      height:w + 'px'
    } );
  }

  _setSize( x, y ) {
    this.$field.hide();
    const h = $( '#content' ).height() > this.minHeight ? $( '#content' ).height() : this.minHeight;
    const w = Math.floor( ( h - 60 ) / y );
    this.$field.width( w * x ).height( w * y );
    this.$field.show();
    this._resizeSquares( w );
  }

  _consumeBomb() {
    this.bombsLeft--;
    this.bombMode = false;
    this._unsetBombTargeting();
    $( 'body' ).removeClass( 'bomb-mode' );
    if ( this.bombsLeft === 0 ) {
      $( '#bomb' ).addClass( 'disabled' );
    }
  }

  _setBombTargeting() {
    const s = this.bombSize;
    $( '.square' ).on( 'mouseleave.bombTargeting', function () {
      $( this ).removeClass( 'hover-hover' );
    } );
    $( '.square' ).on( 'mouseenter.bombTargeting', function () {
      const x = +$( this ).attr( 'data-x' );
      const y = +$( this ).attr( 'data-y' );
      $( '.square' ).removeClass( 'bomb-hover' );
      cartesianMap( x - s, x + s + 1, y - s, y + s + 1, ( i, j ) => $( `#s_${i}_${j}` ).addClass( 'bomb-hover' ) );
    } );
  }

  _unsetBombTargeting() {
    $( '.square' ).off( 'mouseleave.bombTargeting mouseenter.bombTargeting' );
    $( '.square' ).removeClass( 'bomb-hover' );
  }

  updateTimer( v ) {
    this.$timer.text( v );
  }

  updateFlagsCount( n ) {
    this.$flags.text( n );
  }

  viewField() {
    const vewFieldTitle = $( '<h1 id="view-field-title">Click anywhere to close this view.</h1>' );
    $( 'body' ).append( vewFieldTitle );
    $( '#field' ).css( {
      zIndex: 999999,
      position: 'absolute',
      left: ( $( document ).width() / 2 ) - ( $( '#field' ).width() / 2 ) + 'px'
    } ).addClass( 'no-hover' );
    $( window ).on( 'resize.viewField', function () {
      $( '#field' ).css( 'left', ( $( document ).width() / 2 ) - ( $( '#field' ).width() / 2 ) + 'px' );
    } );
    setTimeout( function () {
      $( '*' ).on( 'click.viewField', function () {
        $( '#field' ).css( {
          zIndex: 'auto',
          position: 'relative',
          left: 'auto'
        } ).removeClass( 'no-hover' );
        $( window ).off( 'resize.viewField' );
        $( '*' ).off( 'click.viewField' );
        vewFieldTitle.remove();
      } );
    }, 0 );
  }

  createField( settings, engine ) {
    this.active = true;
    this.bombsLeft = settings.bombs;
    this.bombSize = settings.bombSize;
    this.engine = engine;

    const x = settings.width;
    const y = settings.height;

    this.$field = $( '<div id="field"></div>' );

    const _this = this;
    $( window ).on( 'resize.field', () => _this._setSize( x, y ) );

    this.$field.on( 'click mousedown contextmenu mouseup', () => false );

    $( '#field' ).remove();
    $( '#content' ).append( this.$field );

    cartesianMap( 0, x, 0, y, ( i, j ) => _this.$field.append(
      $( '<div></div>' ).attr( {
        'id': `s_${i}_${j}`,
        'class': 'square',
        'data-x': i,
        'data-y': j
      } )
    ) );

    this._setSize( x, y );

    // bind actions
    $( '.square' ).on( 'mouseup', function ( e ) {
      FX.playClick();
      e.preventDefault();
      e.stopImmediatePropagation();
      if ( _this.bombMode ) {
        engine.dropBomb( +$( this ).attr( 'data-x' ), +$( this ).attr( 'data-y' ) );
        _this._consumeBomb();
        return;
      }
      if ( e.button === 0 || e.button === 1 ) {
        engine.lClick( +$( this ).attr( 'data-x' ), +$( this ).attr( 'data-y' ) );
      } else {
        engine.rClick( +$( this ).attr( 'data-x' ), +$( this ).attr( 'data-y' ) );
      }
    } );

    $( '#bomb' ).removeClass( 'disabled' );
    $( '#controls' ).show();
  }

  openSquare( x, y, c, silent = false ) {
    const s = `#s_${x}_${y}`;
    $( s ).removeClass( 'doubt marked' );
    if ( c === Content.MINE ) {
      $( s ).addClass( 'mine' );
      if ( !silent ) {
        FX.playExplosion();
      }
    } else if ( c === Content.NOTHING ) {
      $( s ).addClass( 'done' );
    } else if ( c > 0 ) {
      $( s ).addClass( 'done n_' + c );
    }
  }

  markSquare( x, y ) {
    $( `#s_${x}_${y}` ).removeClass( 'doubt' ).addClass( 'marked' );
  }

  setDoubtSquare( x, y ) {
    $( `#s_${x}_${y}` ).removeClass( 'marked' ).addClass( 'doubt' );
  }

  setPristineSquare( x, y ) {
    $( `#s_${x}_${y}` ).removeClass( 'marked doubt' );
  }

  endGame() {
    this.active = false;
    $( '.square' ).unbind( 'mouseup' );
    $( window ).unbind( 'resize.field' );
  }
}

export default new UI();
