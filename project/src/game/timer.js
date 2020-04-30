/**
 * chrono class to manage the game time.
 *
 * A simple stopwatch implementation.
 */
const createTimer = () => {
  let startingTime = 0;
  let stoppingTime = 0;
  let started = false;

  const getTime = () => {
    if ( started ) {
      return new Date().getTime() - startingTime;
    } else {
      return startingTime === 0 ? 0 : stoppingTime - startingTime;
    }
  };

  return {
    start() {
      if ( started ) { return false; }

      startingTime = stoppingTime > 0 ?
        startingTime + ( new Date().getTime() - stoppingTime ) :
        new Date().getTime();

      started = true;
      return true;
    },

    stop() {
      if ( !started ) { return false; }
      stoppingTime = new Date().getTime();
      started = false;
      return true;
    },

    reset() {
      started = false;
      startingTime = 0;
      stoppingTime = 0;
      return true;
    },

    format() {
      const time = getTime();
      const s = Math.floor( ( time / 1000 ) % 60 );
      const m = Math.floor( ( time / 60000 ) % 60 );
      const h = Math.floor( ( time / 3600000 ) % 60 );
      const hours = h;
      const minutes = String( m ).padStart( 2, '0' );
      const seconds = String( s ).padStart( 2, '0' );
      return `${hours}:${minutes}:${seconds}`;
    }
  };
};

export default createTimer();
