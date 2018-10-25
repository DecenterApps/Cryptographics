const { BigNumber } = require('bignumber.js');
const web3 = require('./web3Provider');
const clientConfig = require('../../client/config/clientConfig');
const config = require('../../client/config/config');
const logger = require('../config/logger');
const { DEFAULT_AVATAR, ipfsNodePath } = require('./constants');
const { decode, mapUserInfo, getIpfsHashFromBytes32, isEmptyBytes } = require('./utils');
const { getFileContent } = require('./ipfsService');

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const marketPlaceContractAddress = config.marketplaceContract.networks[clientConfig.network].address;
const marketPlaceContract = () => new web3.eth.Contract(config.marketplaceContract.abi, marketPlaceContractAddress);

const functionsContractAddress = config.functionsContract.networks[clientConfig.network].address;
const functionsContract = () => new web3.eth.Contract(config.functionsContract.abi, functionsContractAddress);

const getAssetsOrigins = async (assetIds) => {
  const assetPacks = await assetManagerContract().methods.pickUniquePacks(assetIds).call();
  return [...new Set(assetPacks)];
};

/**
 * Calculates asset metaData based on the seed
 *
 * @param seed
 * @param assetId
 * @return {*}
 */
const getAssetMetadata = (seed, assetId) => {
  seed = seed.toString();
  let number = new BigNumber(seed);
  if (parseInt(number.modulo(2), 10) === 0) {
    let id = assetId;
    let x_coordinate = parseInt(number.modulo(2480), 10);
    let y_coordinate = parseInt(number.modulo(3508), 10);
    let scale = parseInt(number.modulo(200), 10) + 800;
    let rotation = parseInt(number.modulo(360), 10);
    let layer = parseInt(number.modulo(1234567), 10);
    return {
      id,
      x_coordinate,
      y_coordinate,
      scale,
      rotation,
      layer
    };
  }
  return null;
};

/**
 * @param random_seed
 * @param iterations
 * @return {string}
 */
const calculateFinalSeed = (random_seed, iterations) => {
  let seed = web3.utils.soliditySha3(random_seed, iterations);
  for (let i = 0; i < iterations; i++) {
    seed = web3.utils.soliditySha3(seed, i);
  }
  return seed;
};

/**
 * Gets the graphic price if it is for sale
 *
 * @param imageId
 * @return {Promise<any>}
 */
const getImagePrice = async (imageId) => {
  const marketplaceAd = await marketPlaceContract().methods.sellAds(imageId).call();
  return marketplaceAd.active ? web3.utils.fromWei(marketplaceAd.price, 'ether') : 0;
};

/**
 * Gets graphic data from the contract
 *
 * @param imageId
 * @param getPrice
 * @return {Promise<any>}
 */
const getGalleryImage = async (imageId, getPrice) =>
  new Promise(async (resolve) => {
    const image = await digitalPrintImageContract().methods.getGalleryData(imageId).call();
    if (!image) resolve({});
    const price = !getPrice ? undefined : await getImagePrice(imageId);
    let metadata = {
      'title': 'Failed fetching metadata',
      'description': 'Failed fetching metadata',
      'frame': 0,
      'width': 2480,
      'height': 3508
    };
    try {
      const metadataIpfs = await getFileContent(image[5]);
      metadata = JSON.parse(metadataIpfs);
    } catch (e) {
      console.error('Error getting ipfs metadata for image with ID: ', imageId);
      console.error(e);
    }
    const hasFrame = parseInt(metadata.frame) === 1;
    const userAvatar = isEmptyBytes(image[3]) ? DEFAULT_AVATAR : `${ipfsNodePath}${getIpfsHashFromBytes32(image[3])}`;
    resolve({
      id: imageId,
      creator: image[0],
      owner: image[1],
      username: image[2],
      avatar: userAvatar,
      ipfsHash: image[4],
      src: `${ipfsNodePath}${image[4]}`,
      hasFrame,
      width: metadata.width,
      height: metadata.height,
      title: metadata.title,
      description: metadata.description,
      price,
    });
  });

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
 * @return {Promise<{packName: string, packCoverIpfs: *, packCoverSrc: string, creator: *, id: *, assets: Array}>}
 */
const getAssetPackData = async (assetPackId) => {
  let response = await assetManagerContract().methods.getAssetPackData(assetPackId).call();
  const creator = response[1];
  const packCoverIpfs = getIpfsHashFromBytes32(response[0]);

  let metadata;
  try {
    const metadataIpfs = await getFileContent(response[6]);
    metadata = JSON.parse(metadataIpfs);
  } catch (e) {
    metadata = {
      name: '',
      description: '',
    };
  }

  return {
    title: metadata.name,
    packCoverIpfs,
    packCoverSrc: `https://ipfs.decenter.com/ipfs/${packCoverIpfs}`,
    id: assetPackId,
    creator,
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
 * Gets data for selected asset packs ids
 *
 * @param assetPackIds
 * @return {Promise<any>}
 */
const getSelectedAssetPacksWithAssetData = (assetPackIds) =>
  new Promise(async (resolve, reject) => {
    let assetPackPromises = assetPackIds.map(assetPackId => getAssetPackData(assetPackId));

    Promise.all(assetPackPromises)
      .then(assetPacks => {
        resolve(assetPacks);
      })
      .catch(error => {
        reject(error);
      });
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

/**
 * Calls provided contract and subscribes to the provided event
 *
 * @param contractPromise
 * @param event
 * @param callback
 * @return {Promise<any>}
 */
const listenToEvent = (contractPromise, event, callback) =>
  new Promise(async (resolve, reject) => {
    const contract = await contractPromise();

    try {
      const subscription = contract.events[event]((err) => {
        if (err) {
          logger.error('Listen to event error', err);
          reject(err);
          return;
        }
      });

      subscription.on('data', (event) => {
        callback(event.returnValues, event.transactionHash, event.blockNumber)
      });

      subscription.on('error', (e) => {
        logger.error('Listen to event error', event, e);
      });

      resolve(true);
    } catch (e) {
      logger.error('Listen to event error', event, e);
      reject(e);
    }
  });

module.exports = {
  getLatestEvents,
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
  getImageMetadata,
  getUserInfo,
  getAssetPackData,
  getGalleryImage,
  getSelectedAssetPacksWithAssetData,
  getAssetsOrigins,
  listenToEvent,
};
