const path = require( 'path' );

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: '[name].js',
  },
};