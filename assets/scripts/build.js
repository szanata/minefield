({
  baseUrl: '../js/mines',
  name: 'main',
  out: '../../public/scripts/js-bundle.js',
  include:[
    '../vendor/require'
  ],
  fileExclusionRegExp: /^(r|build)\.js$/,
  paths: {
    jquery: '../vendor/jquery-2.1.0.min'
  },
  insertRequire:[
    'main'
  ]
})
