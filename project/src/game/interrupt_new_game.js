
import { GameDifficulty } from './constants';
import { GameSettings } from './models';

const newGameDialog = () =>
  $( '<div class="popup-content">' ).append(
    $( '<p>To start a new game choose a difficulty</p>' ),
    $( '<div id="new-game-options">' ).append(
      $( '<a href="#" data-difficulty="kids-play">' ).append(
        $( '<span>Kid\'s Play</span>' )
      ),
      $( '<a href="#" data-difficulty="medium">' ).append(
        $( '<span>Medium</span>' )
      ),
      $( '<a href="#" data-difficulty="insane">' ).append(
        $( '<span>Insane</span>' )
      )
    )
  );

export default async () =>
  new Promise( r =>
    Lollipop.open( {
      content: newGameDialog(),
      title: 'New game',
      width: '600px',
      showCancelButton: false,
      onOpen() {
        $( this ).find( 'a[data-difficulty]' ).on( 'click', async function ( e ) {
          e.preventDefault();
          const difficulty = $( this ).attr( 'data-difficulty' );
          switch ( difficulty ) {
          case GameDifficulty.INSANE:
            r( new GameSettings( 20, 20, 60 ) );
            break;
          case GameDifficulty.MEDIUM:
            r( new GameSettings( 15, 15, 25 ) );
            break;
          case GameDifficulty.KIDS_PLAY:
            r( new GameSettings( 10, 10, 10 ) );
            break;
          }

          Lollipop.close();
        } );
      }
    } )
  );

