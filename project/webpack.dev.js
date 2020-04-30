const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

module.exports = merge( common, {
  mode: 'development',
  watch: true,
  watchOptions: {
    poll: 1000 // The default
  },
  devServer: {
    compress: true,
    port: 8088
  }
} );
