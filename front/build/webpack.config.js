const path = require('path');
const webpack = require('webpack');
require('babel-polyfill');

const config = {
  entry: {
    app: path.resolve(__dirname, '../src/client-entry.js'),
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
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
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'dist/assets/js/[name].js',
  },
  plugins: [],
};

module.exports = config;
