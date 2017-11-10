define([
  'model', 
  'fx',
  'drawer',
  'timer'
], function (model, fx, drawer, timer){

  var 
    settings = null,
    result = null,
    squares = null,
    emptySquaresCount = 0,
    endGameCallback = null,
    revealedSquaresCount = 0;
        
  /**
   * returns a random square in the collection
   */
  function getRandomSquare(){
    var x = Math.round(Math.random() * (settings.width - 1)),
      y = Math.round(Math.random() * (settings.height - 1));
    return getSquare(x,y);
  }
  
  /**
   * returns a square at x-y position
   */
  function getSquare(x, y){
    if (x >= settings.width || y >= settings.height || x < 0 || y < 0 ){return null;}
    for (var i = 0, li = squares.length; i < li; i++ ){
      if (x === squares[i].x && y === squares[i].y ){
        return squares[i];
      }
    }
    return null;
  }

  function resetSquares(){
    var x, y, lx = settings.width, ly = settings.height, s;
    for (x = 0; x < lx; x++ ){
      for (y = 0; y < ly; y++){
        s = getSquare(x, y);
        s.state = model.State.READY;
      }
    }
  }
    
  /**
   * add indicators to around all mines
   */
  function putIndicators (){
    var s, i, j, x, y;
    for (i = 0; i < settings.width; i++ ){
      for (j = 0; j < settings.height; j++){
        if (getSquare(i, j).isContentMine()){
          for (x = i-1; x <= i+1; x++){
            for (y = j-1; y <= j+1; y++){
              s = getSquare(x,y);
              if (s !== null && !s.isContentMine()){
                s.content = s.content + 1;
              }
            }
          }
        }
      }
    }
  }
    
  /**
   * put all mines on the game
   */
  function putMines(){
    var mines = settings.minesTotal, s;
    while (mines > 0){
      s = getRandomSquare();
      if (!s.isContentMine()){
        s.content = model.Content.MINE;
        mines--;
      }
    }
  }
    
  /**
   * create an array with squares
   */
  function createSquares(){
    squares = [];
    var x, y, lx = settings.width, ly = settings.height;
    for (x = 0; x < lx; x++ ){
      for (y = 0; y < ly; y++){
        squares.push(new model.Square(x, y));
      }
    }
  }
    
  /**
   * reveal the mines to player, used on lose
   */
  function revealMines(){
    var squaresToReveal = [];
    for (var i = 0; i < settings.width; i++ ){
      for (var j = 0; j < settings.height; j++){
        var s = getSquare(i, j);
        if (s.isContentMine() && s.isStateReady()){
          s.state = model.State.DONE;
          squaresToReveal.push(new model.Square(i, j));
        }
      }
    }  
    drawer.openAllMines(squaresToReveal);
  }
    
  /**
  * tests whether win conditions were achieved
  */
  function testWin(){
    if (squares.every(function (s){
      return s.isContentMine() ? s.isStateMarked() : true;
    }) && squares.filter(function (s){
      return s.isStateMarked();
    }).length === settings.minesTotal){
      endGame(model.ResultState.WIN);
    }
  }

  /**
   * this will propagate the open of all empty fields physically linked to an empty field clicked.
   */
  function emptyPropagation(x, y){
    var i, j, s;
    for (i = (x - 1); i < (x + 2); i++){
      for (j = (y - 1); j < (y + 2); j++){
        if (x !== i || y !== j){
          s = getSquare(i,j);
          if (s !== null && s.isStateReady()){
            s.state = model.State.DONE;
            drawer.doneState(s.x,s.y,s.content);
            if (s.content === model.Content.NOTHING){
              emptyPropagation(s.x, s.y);
            }
          }
        }
      }
    }
  }

  function getReveleadAmount(){
    return squares.filter(function (s){
      return (s.isStateDone() && !s.isContentMine()) || 
        (s.isContentMine() && s.isStateMarked());
    }).length;
  }

  function getMinesLeftAmount(){
    return squares.filter(function (s){
      return !s.isStateMarked() && s.content === model.Content.MINE;
    }).length;
  }

  function endGame(state){
    timer.stop();
    result.squaresRevealed = getReveleadAmount();
    result.squaresRevealedPercent = result.squaresRevealed / (settings.width * settings.height) * 100;
    result.minesLeft = getMinesLeftAmount();
    result.state = state;
    result.formattedTime = timer.format();
    drawer.endGame();
    endGameCallback(result);
  }
    
  /**
  * left click action
  */
  function lClick(x, y){
    result.clicks++;
    var s = getSquare(x,y);
    if (s.isStateReady()){
      fx.play(model.SoundType.CLICK);
      s.state = model.State.DONE;
      drawer.doneState(x, y, s.content);
      if (s.isContentMine()){
        fx.play(model.SoundType.EXPLOSION);
        endGame(model.ResultState.LOSE);
        //revealMines();
      } else if (s.content === model.Content.NOTHING){
        emptyPropagation(x,y);
      }

      // win by revealing all      
      if (squares.filter(function (s){return s.isStateDone();}).length === emptySquaresCount){
        endGame(model.ResultState.WIN);
      }
    }
  }

  function rClick(x, y){
    result.clicks++;
    var s = getSquare(x, y);
    if (s.isStateReady()){
      s.state = model.State.MARKED;
      drawer.markedState(x, y);
      testWin();
    } else if (s.isStateMarked()){
      s.state = model.State.DOUBT;
      drawer.doubtState(x, y);
    } else if (s.isStateDoubt()){
      s.state = model.State.READY;
      drawer.readyState(x, y);
    }
    drawer.updateFlagsCount(settings.minesTotal - squares.filter(function (s){
      return s.isStateMarked();
    }).length);
  }

  function bombDrop(x, y){
    result.clicks++;
    var 
      d = settings.getBombTargetingSize(), s,
      i, j, ii = x - d, li = x + d, ij = y - d, lj = y + d;
    fx.play(model.SoundType.EXPLOSION);
    for (i = ii; i <= li; i++){
      for (j = ij; j <= lj; j++){
        s = getSquare(i, j);
        if (s.isContentMine()){
          s.state = model.State.MARKED;
          drawer.markedState(i, j);
        } else {
          s.state = model.State.DONE;
          drawer.doneState(i, j, s.content);
          if (s.content === model.Content.NOTHING){
            (function (_x, _y){
              setTimeout(function (){
                emptyPropagation(_x, _y);
              }, 5);
            }(i, j));
          }
        }
        // win by revealing all      
        if (squares.filter(function (s){return s.isStateDone();}).length === emptySquaresCount){
          endGame(model.ResultState.WIN);
        }
      }
    }
    drawer.updateFlagsCount(settings.minesTotal - squares.filter(function (s){
      return s.isStateMarked();
    }).length);
  }

  return {
    
    start: function (_settings, initType, _endGameCallback){
      result = new model.Result();
      endGameCallback = _endGameCallback;
      if (initType === model.GameInit.NEW_GAME){
        settings = _settings;
        createSquares();
        putMines();
        putIndicators();  
      } else {
        resetSquares();
      }
      timer.reset();
      timer.start();
      drawer.field(settings, rClick, lClick, bombDrop);
      drawer.startTimer();
      drawer.updateFlagsCount(settings.minesTotal);
      emptySquaresCount = (settings.width * settings.height) - settings.minesTotal;
      drawer.startGame();
    },
  };        
});
