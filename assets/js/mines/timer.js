/**
 * chrono class to manage the game time.
 *
 * A simple stopwatch implementation.
 */
define([], function (){

  var
    startingTime = 0,
    stoppingTime = 0,
    started = false;

  function getTime(){
    if (started){
      return new Date().getTime() - startingTime;
    } else {
      if (startingTime === 0){
        return 0;
      } else {
        return stoppingTime - startingTime;
      }
    }
  }

  function format(){
    var
      time = getTime(),
      ms = Math.floor(time % 1000),
      s = Math.floor((time / 1000) % 60),
      m = Math.floor((time / 60000) % 60),
      h = Math.floor((time / 3600000) % 60),
      hours = h,
      minutes = String(m).padLeft(2,'0'),
      seconds = String(s).padLeft(2,'0'),
      millis = String(Math.floor(ms / 10)).padLeft(2,'0');
    return '{0}:{1}:{2}'.format(hours, minutes, seconds);
  }

  return {

    start: function (){
      if (!started){
        startingTime = stoppingTime > 0
        ? startingTime + (new Date().getTime() - stoppingTime)
        : new Date().getTime();
        started = true;
      }
    },

    stop: function (){
      if (started){
        stoppingTime = new Date().getTime();
        started = false;
      }
    },

    reset: function (){
      started = false;
      startingTime = 0;
      stoppingTime = 0;
    },

    format: function (){
      return format();
    }
  };
});
