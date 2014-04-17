define([
  'model', 
  'timer',
  '../Lollipop.min']
, function (model, timer, Lollipop){
	
  var
    paused = false,
    timerInterval,
    $timer,
    $flagsCounter;
  
  return {

    init: function (){
      $timer = $('#timer');
      $flagsCounter = $('#flags-counter');

      //creates the listener to pause
      var _this = this;
      $(document).bind('keypress', function (event){
        if (event.keyCode === 32){ //space
          if (paused){
            _this.resumeGame();
          } else {
            _this.pauseGame();
          }
        }
      });
    },

    startTimer: function (){
      timerInterval = setInterval(function (){
        $timer.text(timer.format());
      }, 500);
    },

    stopTimer: function (){clearInterval(timerInterval);},

    updateFlagsCount: function (n){$flagsCounter.text(n);},

    field: function (x, y, rcCallback, lcCallback){

      $('#field').remove();
      $('#field-wrapper').append('<div id="field"></div>');
      $('#field').bind('click mousedown contextmenu mouseup',function (){
        return false;
      });
      $('#field').focus();
            
      var s = Math.floor( ( $(window).height() - 100 - (y*2) ) / y );      
      var table = $('<table></table>');
            
      for (var i = 0; i < y; i++){
        var row = $('<tr></tr>');
        for (var j = 0; j < x; j++){
          var cell = $('<td></td>');
          cell.append($('<div></div>').attr({
            'id':'s_' + j + '_' + i,
            'class':'square corners',
            'data-y':i,
            'data-x':j
          }));
          row.append(cell);
        }
        table.append(row);
      }
      $('#field').append(table);
      $('.square').width(s);
      $('.square').height(s);
      $('.square').on('mouseup', function (e){
        if (e.button === 0 || e.button === 1){      
          lcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
        } else {
          rcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
        }
      });
      $('#field').width( table.width() );
    },
    doneState: function (x, y, c){
      var s = '#s_{0}_{1}'.format(x, y);
      $(s).removeClass('doubt marked');
      if ( c === model.Content.MINE){
        $(s).addClass('mine');
      } else if ( c === model.Content.NOTHING){
        $(s).addClass('done');
      } else if ( c > 0 ){
        $(s).addClass('done n_' + c);
      }
    },
    markedState: function (x, y){
      $('#s_{0}_{1}'.format(x, y)).removeClass('doubt').addClass('marked');
    },
    doubtState: function (x, y){
      $('#s_{0}_{1}'.format(x, y)).removeClass('marked').addClass('doubt');
    },
    readyState: function (x, y){
      $('#s_{0}_{1}'.format(x, y)).removeClass('marked doubt');
    },
    endGame:function (){
      $('.square').unbind('mouseup');
      this.stopTimer();
      timer.reset();
    },
    openAllMines: function (minesToOpen){
      var 
        amount = minesToOpen.length,
        nextMine = 0,
        _this = this;

      var interval = setInterval(function (){
        if (nextMine === amount){
          clearInterval(interval);
        } else {
          _this.doneState(minesToOpen[nextMine].x, minesToOpen[nextMine].y, model.Content.MINE);
          nextMine++;
        }
      }, 10);
    },
    pauseGame: function (){
      var _this = this;
      paused = true;
      timer.stop();
      $('#field').hide();
      Lollipop.open({
        showTitle:false,
        content:'<h1>Pause</h1>',
        showCancelButton:false,
        buttons:[{
          title:'Unpause',
          click: function (){
            Lollipop.close();
            _this.resumeGame();
          }
        }]
      });
    },
    resumeGame: function (){
      paused = false;
      timer.start();
      Lollipop.close();
      $('#field').show();
    }
  }
});