const { resolve } = require( 'path' );
const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

module.exports = merge( common, {
  mode: 'development',
  watchOptions: {
    poll: 1000 // The default
  },
  devtool: 'eval-source-map',
  devServer: {
    compress: true,
    port: 8088
  },
  output: {
    path: resolve( __dirname, 'dist' ),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].js.map'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
} );
