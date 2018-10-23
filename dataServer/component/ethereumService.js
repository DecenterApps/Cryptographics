const web3 = require('../web3Provider');
const clientConfig = require('../../client/config/clientConfig');
const config = require('../../client/config/config');

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
export const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
export const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const marketPlaceContractAddress = config.marketplaceContract.networks[clientConfig.network].address;
export const marketPlaceContract = () => new web3.eth.Contract(config.marketplaceContract.abi, marketPlaceContractAddress);

const functionsContractAddress = config.functionsContract.networks[clientConfig.network].address;
export const functionsContract = () => new web3.eth.Contract(config.functionsContract.abi, functionsContractAddress);