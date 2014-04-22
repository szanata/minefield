/*
*/
define([
  'jquery',
  'partials',
  '../Lollipop.min', 
  'model']
, function ($, partials, Lollipop, model){
  
  var 
    kidsPlaySettings = new model.GameSettings(10, 10, 10),
    mediumSettings = new model.GameSettings(15, 15, 25),
    insaneSettings = new model.GameSettings(20, 20, 60);

  return {
    start: function (callback){
      var $this = partials.newGame;
      
      Lollipop.open({
        content:$this,
        title:'New game',
        showCancelButton: false,
        onOpen: function (){
          $(this).find('a[data-difficulty]').on('click', function (e){
            e.preventDefault();
            switch ($(this).attr('data-difficulty')){
              case model.GameDifficulty.INSANE:
                callback(insaneSettings);
                break;
              case model.GameDifficulty.MEDIUM:
                callback(mediumSettings);
                break;
              case model.GameDifficulty.KIDS_PLAY:
                callback(kidsPlaySettings);
                break;
            }
            Lollipop.close();
          });
        }
      });
    }
  };
});