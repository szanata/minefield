const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = merge( common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 5000,
      maxSize: 80000
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin( {
        terserOptions: {
          output: {
            comments: false
          }
        }
      } )
    ]
  }
} );
