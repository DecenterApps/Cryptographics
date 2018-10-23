'use strict';

const config = require('../config/main');
const Web3 = require('web3');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.environments.mainnet;
}
const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcEndpoint[process.env.NODE_ENV]));

module.exports = web3;
