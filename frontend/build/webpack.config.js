const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

require('babel-polyfill');

const config = {
  entry: [
    'babel-polyfill',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://127.0.0.1:3300',
    path.resolve(__dirname, '../src/client-entry.js'),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
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
      pages: path.resolve(__dirname, '../src/components/Pages')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
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
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '../prod.html'),
      filename: 'index.html',
      // favicon: 'src/favicon.ico',
      hash: true,
    }),
    new AddAssetHtmlPlugin([
      {
        filepath: require.resolve('../lib/ipfs.min.js'),
        includeSourcemap: false,
      },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin()
  ],
};

module.exports = config;
