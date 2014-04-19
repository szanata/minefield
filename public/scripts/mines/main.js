if (!String.prototype.padLeft) {
  String.prototype.padLeft = function (num, ch) {
    var
      re = new RegExp(".{" + num + "}$"),
      pad = "";
    do {
      pad += ch;
    } while(pad.length < num);
    return re.exec(pad + this)[0];
  };
}

if (!String.format){
  String.format = function(){
    for (var i = 0, args = arguments; i < args.length - 1; i++)
      args[0] = args[0].replace(RegExp("\\{" + i + "\\}", "gm"), args[i + 1]);
    return args[0];
  };

  String.prototype.format = function(){
    var args = Array.prototype.slice.call(arguments).reverse();
    args.push(this);
    return String.format.apply(this, args.reverse());
  }; 
}

require.config({
  paths: {
    jquery: '../jquery-2.1.0.min'
  }
});

define('main', [
  'model',
  'jquery',
  'newGame',
  'loadDialog',
  'fx',
  'drawer',
  'engine',
  'endGame', 
  '../Lollipop.min']
, function (model, $, newGameDialog, loadDialog, fx, drawer, engine, endGameDialog, Lollipop){

  var lastGameSettings = null;

  function startGame(gameSettings, gameInitType){
    engine.start(gameSettings, gameInitType, function (gameResult){
      endGameDialog.start(gameResult, function (gameInit){
        if (gameInit === model.GameInit.RESTART){
          restart();
        } else {
          newGame();
        }
      });
    });
  }

  function newGame(){
    newGameDialog.start(function (gameSettings){
      lastGameSettings = gameSettings;
      startGame(gameSettings, model.GameInit.NEW_GAME);
    });
  }

  function restart(){
    startGame(lastGameSettings, model.GameInit.RESTART);
  }

  Lollipop.config({
    closeOnEsc:false,
    animateOnClose:false
  });

  $(function (){
    fx.init();
    drawer.init();

    $('[data-function="restart"]').on('click', function (e){
      e.preventDefault();
      restart();
    });
    
    $('[data-function=start]').on('click', function (e){
      e.preventDefault();
      $('#start-wrapper').remove();
      newGame();
    });
  });
});