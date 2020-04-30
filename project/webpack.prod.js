const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const CompressionPlugin = require( 'compression-webpack-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = merge( common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 5000,
      maxSize: 80000
    },
    minimizer: [
      new TerserPlugin( {
        terserOptions: {
          output: {
            comments: false
          }
        }
      } )
    ]
  },
  plugins: [
    new CompressionPlugin( {
      test: /\.(js|css|html|svg)$/,
      filename: '[path][query]',
      algorithm: 'gzip',
      threshold: 0,
      minRatio: 0.8
    } ),
    new OptimizeCSSAssetsPlugin()
  ]
} );
