'use strict';

// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const httpStatus = require('http-status-codes');
const helmet = require('helmet');
const morgan = require('morgan');

// Components
const server = require('./config/socket')(app);
const config = require('./config/main');
const routes = require('./component/router');
const logger = require('./config/logger');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.environments.mainnet
}
const env = process.env.NODE_ENV;

// Middlewares
app.use(helmet());
app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.urlencoded({limit: '500kb', extended: true}));
app.use(morgan('dev', { 'stream': logger.stream }));

// Enable CORS from client-side
app.use(function (req, res, next) {
  const allowedOrigins = ['https://cryptographics.app', 'http://localhost:3300'];

  if (allowedOrigins.indexOf(req.headers.origin) > -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }

  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});

// Import routes to be served
app.use('/api/', routes);

// If no route is matched by now, return API version
app.use(function (req, res) {
  logger.info('Wrong end point: ' + req.originalUrl);
  res.status(httpStatus.OK);
  res.json({
    'api_endpoint': config.domain + '/api/',
    'version': config.version,
    'request': req.originalUrl
  })
});

const port = config.port;

// Start the server
server.listen(port, () => {
  logger.info('Current environment: %s', env);
  logger.info('Cryptographics API. Server listening on port %s', port);
  logger.info('Domain: %s', config.domain)
});

module.exports = app;
