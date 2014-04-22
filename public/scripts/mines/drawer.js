define([
  'model', 
  'timer',
  '../Lollipop.min']
, function (model, timer, Lollipop){
	
  var
    paused = false,
    timerInterval,
    $timer,
    minHeight = 600,
    $flagsCounter;
  
  function resizeSquares(w){
    $('.square').css({
      fontSize:(w / 2) + 'px',
      lineHeight:w + 'px',
      width:w + 'px',
      height:w + 'px'
    });
  }

  function bindSquaresEvents(lcCallback, rcCallback){
    $('.square').on('mouseup', function (e){
      if (e.button === 0 || e.button === 1){      
        lcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
      } else {
        rcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
      }
    });
  }

  return {

    init: function (){
      $timer = $('#timer');
      $flagsCounter = $('#flags-counter');
      $(window).on('resize.footer', function (){
        $('footer').css('position', $(document).height() > $(window).height() ? 'relative' : 'absolute');
      }).trigger('resize.footer');
    },

    startTimer: function (){
      timerInterval = setInterval(function (){
        $timer.text(timer.format());
      }, 500);
    },

    stopTimer: function (){clearInterval(timerInterval);},

    updateFlagsCount: function (n){$flagsCounter.text(n);},

    field: function (x, y, rcCallback, lcCallback){

      var 
        h = $(window).height() > minHeight ? $(window).height() : minHeight,
        w = Math.floor((h - 100 - (y*2)) / y),
        i, j, cell, $field = $('<div id="field"></div>');

      $(window).on('resize.field', function (){
        var
          h = $(window).height() > minHeight ? $(window).height() : minHeight,
          w = Math.floor((h - 100 - (y*2)) / y);
        resizeSquares(w);
      });

      $('#field').remove();
      $('#field-wrapper').append($field);
      $field.width(w * x)
        .height(w * y)
        .on('click mousedown contextmenu mouseup',function (){
        return false;
      });
            
      for (i = 0; i < y; i++){
        for (j = 0; j < x; j++){
          cell = $('<div></div>');
          cell.attr({
            'id':'s_{0}_{1}'.format(j, i),
            'class':'square',
            'data-y':i,
            'data-x':j
          });
          $field.append(cell);
        }
      }
      resizeSquares(w);
      bindSquaresEvents(lcCallback, rcCallback);
      $('#left-controls, #right-controls').show();
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
      $(window).unbind('resize.field');
      $('[data-function="pause"]').unbind('click');
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