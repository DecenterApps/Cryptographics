const web3 = require('./web3Provider');
const clientConfig = require('../../client/config/clientConfig');
const config = require('../../client/config/config');
const logger = require('../config/logger');
const { decode, mapUserInfo, getIpfsHashFromBytes32 } = require('./utils');

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const marketPlaceContractAddress = config.marketplaceContract.networks[clientConfig.network].address;
const marketPlaceContract = () => new web3.eth.Contract(config.marketplaceContract.abi, marketPlaceContractAddress);

const functionsContractAddress = config.functionsContract.networks[clientConfig.network].address;
const functionsContract = () => new web3.eth.Contract(config.functionsContract.abi, functionsContractAddress);

const getBlock = bn => web3.eth.getBlock(bn);

/**
 * Gets metadata about a user
 *
 * @param address
 * @return {Promise<any>}
 */
const getUserInfo = address =>
  new Promise(async (resolve, reject) => {
    try {
      const userContract = await digitalPrintImageContract();
      const res = await userContract.methods.getUserInfo(address).call();

      resolve(mapUserInfo(res));
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });

/**
 * Gets asset info for the provided assetId
 *
 * @param id
 * @return {Promise<*>}
 */
const getAssetInfo = id => assetManagerContract().methods.getAssetInfo(id).call();

/**
 * Gets all needed data for an asset pack
 *
 * @param assetPackId
 * @return {Promise<{packName: string, packCoverIpfs: *, packCoverSrc: string, creator: *, price: *, id: *, assets: Array}>}
 */
const getAssetPackData = async (assetPackId) => {
  let response = await assetManagerContract().methods.getAssetPackData(assetPackId).call();
  const packCoverIpfs = getIpfsHashFromBytes32(response[0]);

  return {
    packCoverIpfs,
    packCoverSrc: `https://ipfs.decenter.com/ipfs/${packCoverIpfs}`,
    id: assetPackId,
  };
};

/**
 * Gets all data needed to render a CryptoGraphic from multiple contracts
 *
 * @param imageId
 * @return {Promise<any>}
 */
const getImageMetadata = imageId =>
  new Promise(async (resolve, reject) => {
    try {
      const imageMetadata = await digitalPrintImageContract().methods.getImageMetadata(imageId).call();
      const finalSeed = imageMetadata[2];
      const potentialAssets = imageMetadata[5];
      const pickedAssets = await functionsContract().methods.pickRandomAssets(finalSeed, potentialAssets).call();

      let usedAssetsInfo = [];
      pickedAssets.forEach(async assetId => {
        const getInfo = await getAssetInfo(assetId);
        usedAssetsInfo.push(getInfo);
      });

      let hexFinalSeed = web3.utils.toHex(finalSeed);
      if (hexFinalSeed.length < 66) hexFinalSeed = '0x' + hexFinalSeed.substr(2).padStart(64, '0');


      if (!imageMetadata) reject();

      resolve({
        finalSeed: hexFinalSeed,
        id: imageId,
        potentialAssets: decode(potentialAssets),
        usedAssetsBytes: potentialAssets,
        usedAssets: pickedAssets,
        timestamp: imageMetadata[4],
        usedAssetsInfo,
      });
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });

/**
 * Calls provided contract and gets all events for the provided event a returns a formatted version
 *
 * @param contractPromise
 * @param event
 * @param fromBlock
 * @param formatter
 * @return {Promise<any>}
 */
const getLatestEvents = (contractPromise, event, fromBlock, formatter) =>
  new Promise(async (resolve, reject) => {
    const contract = await contractPromise();

    try {
      contract.getPastEvents(event, { fromBlock }, async (error, eventResults) => {
        if (error) return reject(error);

        const promises = eventResults.map(tx => formatter(tx.returnValues, tx.transactionHash, tx.blockNumber));
        const data = await Promise.all(promises);

        resolve(data);
      });
    } catch (e) {
      logger.error(e);
      reject(e);
    }
  });

module.exports = {
  getBlock,
  getLatestEvents,
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
  getImageMetadata,
  getUserInfo,
  getAssetPackData,
};
