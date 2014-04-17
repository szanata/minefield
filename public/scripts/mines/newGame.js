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
          title:'Start new game',
          showCancelButton: false,
          onOpen: function (){
            $(this).find('a[data-dificulty]').on('click', function (e){
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
                  var dificulty;
                  switch ($this.find('.selected').attr('data-dificulty')){
                    case model.GameDificulty.KIDS_PLAY:
                    dificulty = kidsPlaySettings;
                      break;
                    case model.GameDificulty.MEDIUM:
                      dificulty = mediumSettings;
                      break;
                    case model.GameDificulty.INSANE:
                      dificulty = insaneSettings;
                      break;
                  }
                  callback(dificulty);
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