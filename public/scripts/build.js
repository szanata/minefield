({
  baseUrl: './mines',
  name: 'main',
  out: 'main-build.js',
  include:[
    '../require'
  ],
  fileExclusionRegExp: /^(r|build)\.js$/,
  paths: {
    jquery: '../jquery-2.1.0.min'
  },
  insertRequire:[
    'main'
  ]
})