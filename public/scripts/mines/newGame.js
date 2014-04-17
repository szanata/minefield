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
          title:'Welcome to Minefield',
          showCancelButton: false,
          onOpen: function (){
            $(this).find('a[data-difficulty]').on('click', function (e){
              e.preventDefault();
              $(this).siblings('.selected').removeClass('selected');
              $(this).toggleClass('selected');
            });
          },
          buttons:[
            {
              title:'Start',
              click: function (){
                if ($this.find('a.selected').size() > 0){
                  var difficulty;
                  switch ($this.find('.selected').attr('data-difficulty')){
                    case model.GameDifficulty.KIDS_PLAY:
                      difficulty = kidsPlaySettings;
                      break;
                    case model.GameDifficulty.MEDIUM:
                      difficulty = mediumSettings;
                      break;
                    case model.GameDifficulty.INSANE:
                      difficulty = insaneSettings;
                      break;
                  }
                  callback(difficulty);
                  Lollipop.close();
                }
              }
            }
          ]
        });
      });
    }
  };
});