define([
  'model',
  'jquery',
  'partials',
  'drawer',
  '../vendor/Lollipop.min']
, function (model, $, partials, drawer, Lollipop){


  return {
    start: function (gameResult, callback){
      var $this = partials.endGame;
      var buttons = [
        {
          title:'New game',
          click: function (){
            Lollipop.close(true);
            callback(model.GameInit.NEW_GAME);
          }
        },
        {
          title:'View field',
          click: function (){
            drawer.viewField();
          }
        }
      ];

      if (gameResult.state === model.ResultState.WIN){
        $this.find('#lose-badge').hide();
      } else {
        $this.find('#win-badge').hide();
        buttons.push({
          title:'Restart same game',
          click: function (){
            Lollipop.close(true);
            callback(model.GameInit.RESTART);
          }
        });
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
          $(this).find('a[data-difficulty]').on('click', function (e){
            e.preventDefault();
            $(this).siblings('.selected').removeClass('selected');
            $(this).toggleClass('selected');
          });
        },
        buttons: buttons
      });
    }
  }
});
