define([], function (){
  
  var endGame, newGame;

  function makeNewGame(){
    newGame = $('<div class="popup-content">').append(
      $('<p>To start a new game choose a difficulty</p>'),
      $('<div id="new-game-options">').append(
        $('<a href="#" data-difficulty="kids-play">').append(
          $('<span>Kid\'s Play</span>')
        ),
        $('<a href="#" data-difficulty="medium">').append(
          $('<span>Medium</span>')
        ),
        $('<a href="#" data-difficulty="insane">').append(
          $('<span>Insane</span>')
        )
      )
    );
  }

  function makeEndGame(){
    endGame = $('<div class="popup-content">').append( 
      $('<div id="win-badge">').append(
        $('<h2>You win!</h2>')
      ),
      $('<div id="lose-badge">').append(
        $('<h2>You lose!</h2>')
      ),
      $('<table id="game-results">').append(
        $('<tbody>').append(
          $('<tr>').append(
            $('<td><b>Time</b></td><td data-value="time"></td>')
          ),
          $('<tr>').append(
            $('<td><b>Squares Revealed<b></td><td data-value="squares-revealed"></td>')
          ),
          $('<tr>').append(
            $('<td><b>Mines Left<b></td><td data-value="mines-left"></td>')
          ),
          $('<tr>').append(
            $('<td><b>Clicks</b></td><td data-value="clicks"></td>')
          )
        )
      )
    );
  }

  return {
    init: function (){
      makeNewGame();
      makeEndGame();
    },

    get newGame(){
      return newGame.clone();
    },

    get endGame(){
      return endGame.clone();
    }
  }
});