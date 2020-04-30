import './images/marked.svg';
import './images/doubt.svg';
import './images/mine.svg';
import './images/kids-play.svg';
import './images/medium.svg';
import './images/insane.svg';
import './images/custom.svg';
import './images/win.svg';
import './images/lose.svg';

import './vendor/lollipop';

import './fx/click.wav';
import './fx/explosion.wav';

import './styles/main.less';
import './styles/field.less';
import './styles/popups.less';

import Engine from './game/engine';
import UI from './game/ui';
import InterruptNewGame from './game/interrupt_new_game';
import InterruptEndGame from './game/interrupt_end_game';

$( function () {
  const startGame = async () => {
    const gameSettings = await InterruptNewGame();
    new Engine( gameSettings, async gameResult => {
      await InterruptEndGame( gameResult );
      startGame();
    } );
  };

  Lollipop.config( {
    closeOnEsc:false,
    animateOnClose:false
  } );

  UI.init();

  $( '[data-function="new-game"]' ).on( 'click', function ( e ) {
    e.preventDefault();
    startGame();
  } );

  $( '[data-function="start"]' ).on( 'click', function ( e ) {
    e.preventDefault();
    $( '#start-wrapper' ).remove();
    startGame();
  } );
} );
