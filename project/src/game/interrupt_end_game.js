import UI from './ui';

const createEndGame = () =>
  $( '<div class="popup-content">' ).append(
    $( '<div id="win-badge">' ).append(
      $( '<h2>You win!</h2>' )
    ),
    $( '<div id="lose-badge">' ).append(
      $( '<h2>You lose!</h2>' )
    ),
    $( '<table id="game-results">' ).append(
      $( '<tbody>' ).append(
        $( '<tr>' ).append(
          $( '<td><b>Time</b></td><td data-value="time"></td>' )
        ),
        $( '<tr>' ).append(
          $( '<td><b>Open Squares<b></td><td data-value="open-squares"></td>' )
        ),
        $( '<tr>' ).append(
          $( '<td><b>Mines Left<b></td><td data-value="mines-left"></td>' )
        ),
        $( '<tr>' ).append(
          $( '<td><b>Clicks</b></td><td data-value="clicks"></td>' )
        )
      )
    )
  );

export default async result => {
  const $this = createEndGame();
  return new Promise( r => {

    $this.find( result.isWin ? '#lose-badge' : '#win-badge' ).hide();

    const { openSquares, openSquaresPercent, clicks, formattedTime, minesLeft } = result;
    $this.find( '[data-value="open-squares"]' ).text( `${openSquares} (${Math.round( openSquaresPercent * 100 ) / 100}%)` );
    $this.find( '[data-value="clicks"]' ).text( clicks );
    $this.find( '[data-value="time"]' ).text( formattedTime );
    $this.find( '[data-value="mines-left"]' ).text( minesLeft );

    Lollipop.open( {
      content:$this,
      showHeader: false,
      showCancelButton: false,
      maxHeight:'auto',
      height:'auto',
      onOpen: function () {
        $( this ).find( 'a[data-difficulty]' ).on( 'click', function ( e ) {
          e.preventDefault();
          $( this ).siblings( '.selected' ).removeClass( 'selected' );
          $( this ).toggleClass( 'selected' );
        } );
      },
      buttons: [
        {
          title: 'New game',
          click() {
            Lollipop.close( true );
            r();
          }
        },
        {
          title:'View field',
          click() {
            UI.viewField();
          }
        }
      ]
    } );
  } );
};
