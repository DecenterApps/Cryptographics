const path = require('path');
const webpack = require('webpack');


const config = {
  entry: {
    app: path.resolve(__dirname, '../src/client-entry.js'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          css: 'css-loader',
          scss: 'css-loader|sass-loader',
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'dist/assets/js/[name].js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
};

module.exports = config;
