const webpack = require('webpack');
const clientConfig = require('./webpack.config');
const MFS = require('memory-fs');
const path = require('path');

module.exports = function setupDevServer (app, onUpdate) {
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    clientConfig.entry.app
  ];
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
  const clientCompiler = webpack(clientConfig);
  app.use(
    require('webpack-dev-middleware')(clientCompiler, {
      stats: {
        colors: true
      }
    })
  );
  app.use(require('webpack-hot-middleware')(clientCompiler));
}
