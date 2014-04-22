
var 
  express = require('express'),
  app = express(),
  assetManager = require('connect-assetmanager'),
  mime = require('mime'),
  oneYear = 31557600000,
  production = !!process.env.PORT;

var assetManagerGroups = {
  'css': {
    'route': /\/all\.css/,
    'path': __dirname + '/public/styles/',
    'dataType': 'css',
    'files': [ 
      'opensans/stylesheet.css', 
      'armaliterifle/stylesheet.css',
      'style.css' 
    ]
  }/*,
  'js': {
    'route': /\/static\/script\.js/,
    'path': __dirname + '/public/scripts/',
    'dataType': 'javascript',
    'files': [],
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
  app.use(express.static(__dirname + '/public', {maxAge: oneYear}));
  // body parser
  app.use(express.bodyParser());
  // routes
  app.use(app.router);
  //mime types
  mime.define({
    'application/octet-stream': ['ttf'],
    'image/svg+xml': ['svg'],
    'application/vnd.ms-fontobject': ['eot'],
    'application/x-font-woff': ['woff'],
    'audio/wav': ['wav']
  });
});

// routes
app.get('/', function (req, res){
  res.render('index', {production: production});
});

app.get('/end-game', function (req, res){
  res.render('endGame');
});

app.get('/new-game', function (req, res){
  res.render('newGame');
});

app.listen(process.env.PORT || 3456);