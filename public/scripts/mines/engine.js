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
  var getSquare = function (x, y){
    if (x >= settings.width || y >= settings.height || x < 0 || y < 0 ){return null;}
    for (var i = 0, li = squares.length; i < li; i++ ){
      if (x === squares[i].x && y === squares[i].y ){
        return squares[i];
      }
    }
    return null;
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
    for (var i = 0; i < settings.width; i++ ){
      for (var j = 0; j < settings.height; j++){
        squares.push(new model.Square(i,j));
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
    })){
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
    drawer.engGame();
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
        revealMines();
      } else if (s.content === model.Content.NOTHING){
        emptyPropagation(x,y);
      }
      
      //reveal all win condition
      revealedSquaresCount++;
      if (revealedSquaresCount === emptySquaresCount){
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
    drawer.updateFlagsCount(squares.filter(function (s){
      return s.isStateMarked();
    }).length);
  }

  return {
    
    start: function (_settings, _endGameCallback){
      settings = _settings;
      result = new model.Result();
      endGameCallback = _endGameCallback;
      squares = [];
      createSquares();
      putMines();
      putIndicators();
      timer.start();
      drawer.field(settings.width, settings.height, rClick, lClick);
      drawer.startTimer();
      emptySquaresCount = (settings.width * settings.height) - settings.minesTotal;
    }
  };        
});
