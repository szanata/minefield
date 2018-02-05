define([
  'jquery',
  'model',
  'timer',
  'partials',
  '../vendor/Lollipop.min',
  'cookies',
  'fx']
, function ($, model, timer, partials, Lollipop, cookies, fx){

  var
    paused = false,
    timerInterval,
    $timer,
    minHeight = 600,
    gameSettings,
    bombMode = false,
    $flagsCounter;

  function resizeSquares(w){
    $('.square').css({
      fontSize:(w / 2) + 'px',
      lineHeight:w + 'px',
      width:w + 'px',
      height:w + 'px'
    });
  }

  function bindSquaresEvents(lcCallback, rcCallback, bombDrop){
    $('.square').on('mouseup', function (e){
      if (bombMode){
        bombDrop(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
        consumeBomb();
        return;
      }
      if (e.button === 0 || e.button === 1){
        lcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
      } else {
        rcCallback(parseInt( $(this).attr('data-x')), parseInt( $(this).attr('data-y')));
      }
    });
  }

  function consumeBomb(){
    bombMode = false;
    gameSettings.bombsLeft--;
    unsetBombTargeting();
    $('body').removeClass('bomb-mode');
    if (gameSettings.bombsLeft === 0){
      $('#bomb').addClass('disabled');
    }
  }

  function setBombTargeting(size){
    $('.square').on('mouseleave.bombTargeting', function (){$(this).removeClass('hover-hover');});
    $('.square').on('mouseenter.bombTargeting', function (){
      var
        x = parseInt($(this).attr('data-x')),
        y = parseInt($(this).attr('data-y')),
        d = gameSettings.getBombTargetingSize(),
        i, j, ii = x - d, li = x + d, ij = y - d, lj = y + d;
      $('.square').removeClass('bomb-hover');
      for (i = ii; i <= li; i++){
        for (j = ij; j <= lj; j++){
          $('#s_{0}_{1}'.format(i, j)).addClass('bomb-hover');
        }
      }
    });
  }

  function unsetBombTargeting(){
    $('.square').off('mouseleave.bombTargeting mouseenter.bombTargeting');
    $('.square').removeClass('bomb-hover');
  }

  return {

    init: function (){
      $timer = $('#timer');
      $flagsCounter = $('#flags-counter');

      $(window).on('resize.controls', function (){
        $('body')[$(window).width() < 700 ? 'addClass' : 'removeClass']('compact');
      }).trigger('resize.controls');

      $('#mute').on('click', function (e){
        e.preventDefault();
        if ($(this).hasClass('muted')){
          $(this).removeClass('muted');
          fx.unmute();
          cookies.write('m', '0');
        } else {
          $(this).addClass('muted');
          fx.mute();
          cookies.write('m', '1');
        }
      });

      var muted = cookies.read('m');
      if (muted === '1'){
        $('#mute').trigger('click');
      }

      $('#bomb').on('click', function (e){
        e.preventDefault();
        if (gameSettings.bombsLeft > 0){
          if (bombMode){
            $('body').removeClass('bomb-mode');
            unsetBombTargeting();
            bombMode = false;
          } else {
            $('body').addClass('bomb-mode');
            setBombTargeting();
            bombMode = true;
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

    viewField: function (){
      var vewFieldTitle = partials.viewFieldTitle;
      $('body').append(vewFieldTitle);
      $('#field').css({
        zIndex: 999999,
        position: 'absolute',
        left: ($(document).width() / 2) - ($('#field').width() / 2) + 'px'
      }).addClass('no-hover');
      $(window).on('resize.viewField', function (){
        $('#field').css('left', ($(document).width() / 2) - ($('#field').width() / 2) + 'px');
      });
      setTimeout(function (){
        $('*').on('click.viewField', function (){
          $('#field').css({
            zIndex: 'auto',
            position: 'relative',
            left: 'auto'
          }).removeClass('no-hover');
          $(window).off('resize.viewField');
          $('*').off('click.viewField');
          vewFieldTitle.remove();
        });
      }, 0);
    },

    field: function (settings, rcCallback, lcCallback, bombDrop){
      gameSettings = settings;
      var
        x = settings.width, y = settings.height,
        h = $(window).height() > minHeight ? $(window).height() : minHeight,
        w = Math.floor((h - 90) / y),
        i, j, cell, $field = $('<div id="field"></div>');

      $(window).on('resize.field', function (){
        var
          h = $(window).height() > minHeight ? $(window).height() : minHeight,
          w = Math.floor((h - 90) / y);
          $field.width(w * x).height(w * y);
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
      bindSquaresEvents(lcCallback, rcCallback, bombDrop);
      $('#bomb').removeClass('disabled');
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
