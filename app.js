const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const compress = require( 'compression' );
const connect = require( 'connect' );
const assets = require( 'connect-assets' );
const mime = require( 'mime' );
const execSync = require('child_process').execSync;

const app = express();
const oneYear = 31557600000;
const production = !!process.env.PORT;


app.set( 'views', `${__dirname}/views` );
app.set( 'view engine', 'ejs' );

app.use( compress() );

app.use( '/static', express.static( 'public' ) );

execSync('node node_modules/requirejs/bin/r.js -o assets/scripts/build.js');

app.use( assets( {
  paths: [ 'public' ],
  precompile: [ '*.x' ],
  build: false,
  bundle: !production,
  compress: !production,
  gzip: true,
  fingerprinting: !production
} ) );

//mime types
// mime.define({
//   'application/octet-stream': [ 'ttf' ],
//   'image/svg+xml': [ 'svg' ],
//   'application/vnd.ms-fontobject': [ 'eot' ],
//   'application/x-font-woff': [ 'woff ']
// });

// routes
app.get( '/', function ( req, res ) {
  res.render( 'index', { production } );
});

app.listen( process.env.PORT || 3456 );
