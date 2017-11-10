define([], function (){
  
  var endGame, newGame, viewFieldTitle, customGame;

  function makeViewFieldTitle(){
    viewFieldTitle = $('<h1 id="view-field-title">Click anywhere to close this view.</h1>');
  }

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
        ),
        $('<a href="#" data-difficulty="custom">').append(
          $('<span>Custom</span>')
        )
      )
    );
  }

  function makeCustomGame(){
    customGame = $('<div class="popup-content custom-game-content">').append(
      $('<p>To start a custom game, set the field length and the mines amount.</p>'),
      $('<form></form>').append(
        $('<div class="custom-game-content-field-wrapper">').append(
          $('<span class="error"></span>'),
          $('<span>Field length:</span>'),
          $('<input type="number" name="field-width" maxlength="2" pattern="^[0-9]{1,2}$" min="5" max="25" required="required" />'),
          $('<span>squares.</span>'),
          $('<small>The field is always a square, enter the length of one dimension.</small>')
        ),
        $('<div class="custom-game-content-field-wrapper">').append(
          $('<span class="error"></span>'),
          $('<span>Mines amount:</span>'),
          $('<input type="number" name="mines-amount" maxlength="3" pattern="^[0-9]{1,3}$" min="1" max="100" required="required" />'),
          $('<span>%.</span>'),
          $('<small>Mines amount is a percentage relative to the size of the field.</small>')
        ),
        $('<input type="submit" style="display:none" />')
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
      makeViewFieldTitle();
      makeCustomGame();
    },

    get newGame(){
      return newGame.clone();
    },

    get endGame(){
      return endGame.clone();
    },

    get viewFieldTitle(){
      return viewFieldTitle.clone();
    },

    get customGame(){
      return customGame.clone();
    }
  }
});