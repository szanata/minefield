const Storage = {
  get( key ) {
    return localStorage.getItem( key );
  },

  set( key, value ) {
    localStorage.setItem( key, value );
  }
};

export default Storage;
