const web3 = require('./web3Provider');
const clientConfig = require('../../client/config/clientConfig');
const config = require('../../client/config/config');

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const marketPlaceContractAddress = config.marketplaceContract.networks[clientConfig.network].address;
const marketPlaceContract = () => new web3.eth.Contract(config.marketplaceContract.abi, marketPlaceContractAddress);

const functionsContractAddress = config.functionsContract.networks[clientConfig.network].address;
const functionsContract = () => new web3.eth.Contract(config.functionsContract.abi, functionsContractAddress);

const getLatestEvents = (contractPromise, event, fromBlock, formatter) =>
  new Promise(async (resolve, reject) => {
    const contract = await contractPromise();

    contract.getPastEvents(event, { fromBlock }, async (error, eventResults) => {
      if (error) return reject(error);

      const promises = eventResults.map(tx => formatter(tx.returnValues));
      const data = await Promise.all(promises);

      resolve(data);
    });
  });

module.exports = {
  getLatestEvents,
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
};
