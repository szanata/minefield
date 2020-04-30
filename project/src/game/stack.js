const createStack = () => {
  const actions = [];
  const listeners = {

  };
  return {
    add( action, args ) {
      actions.push( { actions, args } );
      setTimeout( () => {
        if ( listeners[action] ) {
          listeners[actions].forEach( cb => {
            cb( args );
          } );
        }
      }, 5 );
    },

    listen( action, callback ) {
      if ( listeners[action] ) {
        listeners[action].push( callback );
      } else {
        listeners[action] = [ callback ];
      }
    }
  };
};

export default createStack();
