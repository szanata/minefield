/*
*/
define([
  'jquery', 
  '../Lollipop.min', 
  'loadDialog',
  'model']
, function ($, Lollipop, loadDialog, model){
  
  var 
    kidsPlaySettings = new model.GameSettings(10, 10, 10),
    mediumSettings = new model.GameSettings(15, 15, 20),
    insaneSettings = new model.GameSettings(20, 20, 50);

  return {
    start: function (callback){
      loadDialog.start();
      $('<div></div>').load('/new-game', function (){
        loadDialog.stop();
        var $this = $(this.innerHTML);
        
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
      });
    }
  };
});