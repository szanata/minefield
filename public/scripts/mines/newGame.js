/*
*/
define([
  'jquery',
  'partials',
  '../Lollipop.min', 
  'model',
  'customGame']
, function ($, partials, Lollipop, model, customGame){
  
  var 
    kidsPlaySettings = new model.GameSettings(10, 10, 10),
    mediumSettings = new model.GameSettings(15, 15, 25),
    insaneSettings = new model.GameSettings(20, 20, 60);

  return {
    start: function (callback){
      var _this = this;
      var $this = partials.newGame;
      
      Lollipop.open({
        content:$this,
        title:'New game',
        width:'600px',
        showCancelButton: false,
        onOpen: function (){
          $(this).find('a[data-difficulty]').on('click', function (e){
            e.preventDefault();
            var difficulty = $(this).attr('data-difficulty');
            Lollipop.close();
            switch (difficulty){
              case model.GameDifficulty.INSANE:
                callback(insaneSettings);
                break;
              case model.GameDifficulty.MEDIUM:
                callback(mediumSettings);
                break;
              case model.GameDifficulty.KIDS_PLAY:
                callback(kidsPlaySettings);
                break;
              case model.GameDifficulty.CUSTOM:
                customGame.start(callback, _this);
                break;
            }
          });
        }
      });
    }
  };
});