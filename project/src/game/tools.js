export function cartesianMap( iS, iE, jS, jE, callback ) {
  for ( let i = iS; i < iE; i++ ) {
    for ( let j = jS; j < jE; j++ ) {
      callback( i, j );
    }
  }
}
