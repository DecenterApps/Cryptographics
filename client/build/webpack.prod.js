const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
  entry: {
    app: ['babel-polyfill', path.resolve(__dirname, '../src/client-entry.js')],
  },
  output: {
    path: path.resolve(__dirname, '../../public'),
    filename: 'assets/js/[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.vue', '.js', '.scss', '.eot', '.svg', '.ttf', '.woff', '.woff2', '.png', '.jpg'],
    alias: {
      store: path.resolve(__dirname, '../src/store/modules'),
      scripts: path.resolve(__dirname, '../scripts'),
      config: path.resolve(__dirname, '../config'),
      services: path.resolve(__dirname, '../src/services'),
      methods: path.resolve(__dirname, '../src/methods'),
      shared: path.resolve(__dirname, '../src/components/Shared'),
      pages: path.resolve(__dirname, '../src/components/Pages'),
      assets: path.resolve(__dirname, '../src/assets'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new TerserPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'client/prod.html',
      filename: 'index.html',
      favicon: 'client/favicon.ico',
      hash: true,
    }),
    new VueLoaderPlugin()
  ],
};

module.exports = config;
