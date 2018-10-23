'use strict';
const path = require('path');

const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.resolve(__dirname, '../logs/err-logs.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: false
    })
  ],
  exitOnError: false
});

module.exports = logger;

module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
};