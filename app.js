
var 
  express = require('express'),
  app = express(),
  assetManager = require('connect-assetmanager'),
  mime = require('mime');

var assetManagerGroups = {
  'css': {
    'route': /\/static\/style\.css/,
    'path': __dirname + '/public/styles/',
    'dataType': 'css',
    'files': [ 'style.css', 'Lollipop.css' ]
  }/*,
  'js': {
    'route': /\/static\/script\.js/,
    'path': __dirname + '/public/scripts/',
    'dataType': 'javascript',
    'files': [ 
      'jquery-2.1.0.min.js', 
      'Lollipop.min.js',
      'require.js',
      'spin.min.js',
      'mines/drawer.js',
      'mines/endGame.js',
      'mines/engine.js',
      'mines/fx.js',
      'mines/loadDialog.js',
      'mines/main.js',
      'mines/model.js',
      'mines/newGame.js',
      'mines/timer.js'
    ],
    'stale':!!process.env.PORT,
    'debug':!process.env.PORT
  },*/
};

app.configure(function (){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // minify + combine
  app.use(assetManager(assetManagerGroups)); 
  // compress + cache
  app.use(express.compress());
  app.use(express.static(__dirname + '/public', {maxAge: 86400000}));
  //app.use(express.static(__dirname + '/public', {maxAge: 0}));
  // body parser
  app.use(express.bodyParser());
  // routes
  app.use(app.router);
  //mime types
  mime.define({
    'application/octet-stream': ['ttf'],
    'image/svg+xml': ['svg'],
    'application/vnd.ms-fontobject': ['eot'],
    'application/x-font-woff': ['woff']
  });
});

// routes
app.get('/', function (req, res){
  res.render('index');
});

app.get('/end-game', function (req, res){
  res.render('endGame');
});

app.get('/new-game', function (req, res){
  res.render('newGame');
});

app.listen(process.env.PORT || 3456);