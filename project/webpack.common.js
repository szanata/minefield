const { resolve } = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { version } = require( './package.json' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );

const srcPath = resolve( __dirname, 'src' );
const distPath = resolve( __dirname, 'dist' );

module.exports = {
  context: srcPath,
  entry: './app.js',
  output: {
    path: distPath,
    filename: 'app.[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /(.svg|.png|.ico|.woff2|.wav)$/i,
        type: 'asset'
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new ESLintPlugin( {
      fix: true,
      exclude: [ 'vendor' ]
    } ),
    new MiniCssExtractPlugin( {
      filename: '[contenthash].css'
    } ),
    new HtmlWebpackPlugin( {
      favicon: './images/favicon.ico',
      inject: true,
      hash: true,
      cache: false,
      template: resolve( srcPath, 'index.html' ),
      meta: { version }
    } ),
    new webpack.ProvidePlugin( {
      'window.jQuery': 'jquery',
      '$': 'jquery',
      'jQuery': 'jquery'
    } )
  ]
};
