define([
  'model',
  'loadDialog',
  '../Lollipop.min']
, function (model, loadDialog, Lollipop){
  

  return {
    start: function (gameResult, callback){

      loadDialog.start();
      $('<div></div>').load('/end-game', function (){
        loadDialog.stop();
        var $this = $(this.innerHTML);

        if (gameResult.state === model.ResultState.WIN){
          $this.find('#lose-badge').hide();
        } else {
          $this.find('#win-badge').hide();
        }

        $this.find('[data-value="squares-revealed"]').text(
          '{0} ({1}%)'.format(
            gameResult.squaresRevealed, 
            Math.round(gameResult.squaresRevealedPercent * 100) / 100
          )
        );
        $this.find('[data-value="clicks"]').text(gameResult.clicks);
        $this.find('[data-value="time"]').text(gameResult.formattedTime);
        $this.find('[data-value="mines-left"]').text(gameResult.minesLeft);

        Lollipop.open({
          content:$this,
          title:'Game over',
          showCancelButton: false,
          maxHeight:'auto',
          height:'auto',
          onOpen: function (){
            $(this).find('a[data-dificulty]').on('click', function (e){
              e.preventDefault();
              $(this).siblings('.selected').removeClass('selected');
              $(this).toggleClass('selected');
            });
          },
          buttons:[
            {
              title:'Restart',
              click: function (){
                Lollipop.close(true);
                callback();
              }
            }
          ]
        });
      });
    }
  }
});