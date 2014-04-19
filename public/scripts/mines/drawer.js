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
      $('#left-controls').show();
      $('#field-wrapper').append('<div id="field"></div>');
      $('#field').bind('click mousedown contextmenu mouseup',function (){
        return false;
      });
      //$('#field').focus();
            
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
      $('.square').css({
        fontSize: (s / 2) + 'px',
        lineHeight: s + 'px',
        width:s + 'px',
        height:s + 'px'
      });
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
    startGame: function (){
      var _this = this;
      $(document).bind('keypress.pause', function (e){
        if (e.keyCode === 32){ //space
          e.preventDefault();
          _this[paused ? 'resumeGame' : 'pauseGame']();
        }
      });

      $('[data-function="pause"]').on('click', function (e){
        e.preventDefault();
        _this[paused ? 'resumeGame' : 'pauseGame']();
      });
    },
    endGame:function (){
      $('.square').unbind('mouseup');
      $(document).unbind('keypress.pause');
      $('[data-function="pause"]').unbind('click');
      $('#left-controls').hide();
      this.stopTimer();
      timer.reset();
      $timer.text(timer.format());
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
        animate:false,
        minHeight:50,
        content:'<h1>Waiting for you :)</h1><p><b>Pro tip</b>: use <i>spacebar</i> to pause/unpause game.</p>',
        showCancelButton:false,
        buttons:[{
          title:'Resume',
          click: function (){
            _this.resumeGame();
          }
        }]
      });
    },
    resumeGame: function (){
      paused = false;
      timer.start();
      Lollipop.close(true);
      $('#field').show();
    }
  }
});