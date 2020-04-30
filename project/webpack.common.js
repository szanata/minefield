const { resolve, join } = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
  context: resolve( __dirname, 'src' ),
  entry: './app.js',
  output: {
    path: join( __dirname, 'dist' ),
    filename: 'app.[chunkhash].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules|vendor/,
        options: { fix: true }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(svg|woff2)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|ico|wav)$/i,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
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
    new MiniCssExtractPlugin( {
      filename: '[contenthash].css'
    } ),
    new HtmlWebpackPlugin( {
      favicon: './images/favicon.ico',
      inject: true,
      hash: true,
      cache: false,
      template: resolve( __dirname, 'src', 'index.pug' )
    } ),
    new webpack.ProvidePlugin( {
      'window.jQuery': 'jquery',
      '$': 'jquery',
      'jQuery': 'jquery'
    } ),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin( [
      { from: 'files/*.txt', to: resolve( __dirname, 'dist' ), flatten: true }
    ] )
  ]
};
