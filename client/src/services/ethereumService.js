import { BigNumber } from 'bignumber.js';
import utils from 'services/utils';
import config from 'config/config.json';
import clientConfig from 'config/clientConfig.json';
import { ipfsNodePath } from 'config/constants';
import landingAssetPacks from 'config/landingAssetPacks.json';
import { layerCompare } from './imageService';
import { getAccounts } from './helpers';
import { DEFAULT_AVATAR, DEFAULT_USERNAME } from 'config/constants';
import * as ipfsService from './ipfsService';

const cryptographicsGetterContractAddress = config.cryptographicsGetter.networks[clientConfig.network].address;
const getterContract = () => new web3.eth.Contract(config.cryptographicsGetter.abi, cryptographicsGetterContractAddress);

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const marketPlaceContractAddress = config.marketplaceContract.networks[clientConfig.network].address;
const marketPlaceContract = () => new web3.eth.Contract(config.marketplaceContract.abi, marketPlaceContractAddress);

const functionsContractAddress = config.functionsContract.networks[clientConfig.network].address;
const functionsContract = () => new web3.eth.Contract(config.functionsContract.abi, functionsContractAddress);

export const pickTenRandoms = () => {
  let randoms = [];
  for (let i = 0; i < 10; i++) {
    randoms.push(Math.floor(Math.random() * 100));
  }
  return randoms;
};

export const checkAssetPermission = async (address, assetPackId) => {
  return await assetManagerContract().methods.checkHasPermissionForPack(address, assetPackId).call();
};

export const changeAssetPackPrice = async (assetPackId, newPrice, address) => 
  new Promise(async (resolve, reject) => {
    if (!web3.utils.isAddress(address)) return;
    const wei = web3.utils.toWei(newPrice, 'ether');
    try {
      const transactionPromise = assetManagerContract().methods.changeAssetPackPrice(assetPackId, wei).send({
        from: address
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e)
      throw new Error('Could not change asset pack price.');
    }
  }
  )

export const buyAssetPack = async (address, assetPackId, price) => {
  if (!web3.utils.isAddress(address)) return { error: 'Address is not valid!' };
  try {
    const price = await assetManagerContract().methods.getAssetPackPrice(assetPackId).call();
    return await assetManagerContract().methods.buyAssetPack(address, assetPackId).send({
      from: address,
      value: price
    }, (error, res) => {
      if (error) {
        return { error: 'Could not buy asset pack' };
      }
      console.log(error, res);
    });
  } catch (e) {
    console.log(e);
    throw { error: 'Could not buy asset pack' };
  }
};

export const getAllAssetPacks = async (assetPackIDs) => {
  return await assetManagerContract().methods.assetPacks(assetPackIDs).call();
};

export const getAllAssetsPacksInfo = async () =>
  new Promise(async (resolve, reject) => {
    let numOfAssetsPacks = await getNumberOfAssetPacks();
    let promises = [];
    for (let i = 0; i < numOfAssetsPacks; i++) {
      promises.push(getAssetPackData(i));
      // let object = {
      //   id: i,
      //   username: await getUsername(data['creator']),
      //   userAddress: data['creator'],
      //   userAvatar: utils.getIpfsHashFromBytes32(await getAvatar(data['creator'])),
      //   name: data['name'],
      //   packCover: utils.getIpfsHashFromBytes32(data['packCover']),
      //   price: web3.utils.fromWei(data['price'], 'ether'),
      //   data
      // };
    }

    Promise.all(promises)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

export const getPackInformation = (assetPackIds) =>
  new Promise(async (resolve, reject) => {
    let promises = assetPackIds.map(id => getAssetPackData(id));
    Promise.all(promises)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAttributesForAssets = async (assetIds) => {
  return await assetManagerContract().methods.getAttributesForAssets(assetIds).call();
};

export const getAssetIpfs = async (assetId) => {
  let ipfsHash = await assetManagerContract().methods.getAssetIpfs(assetId).call();
  return utils.getIpfsHashFromBytes32(ipfsHash);
};

export const getAssetsIpfs = async (assets) => {
  const ids = assets.map(asset => asset.id);
  let ipfsHashes = await assetManagerContract().methods.getIpfsForAssets(ids).call();
  for (let i = 0; i < ipfsHashes.length; i++) {
    ipfsHashes[i] = utils.getIpfsHashFromBytes32(ipfsHashes[i]);
  }
  return ipfsHashes;
};

export const getImageIpfs = async (imageId) => {
  return await digitalPrintImageContract().methods.idToIpfsHash(imageId).call();
};

export const getCreatedAssetPacks = async (address) => {
  return await assetManagerContract().methods.getAssetPacksUserCreated(address).call();
};

export const getBoughtAssetPacks = async (address) => {
  return await assetManagerContract().methods.getBoughtAssetPacks(address).call();
};

export const getCoversForAssetPacks = async (assetPackIds) => {
  let hovers = await assetManagerContract().methods.getCoversForPacks(assetPackIds).call();
  for (let i = 0; i < hovers.length; i++) {
    hovers[i] = utils.getIpfsHashFromBytes32(hovers[i]);
  }
  return hovers;
};

export const getAssetPacksNames = async (assetPacksIds) => {
  let names = [];
  for (let i = 0; i < assetPacksIds.length; i++) {
    let name = await assetManagerContract().methods.getAssetPackName(assetPacksIds[i]).call();
    names.push(name);
  }
  return names;
};

export const getNumberOfAssetPacks = async () => {
  return await assetManagerContract().methods.getNumberOfAssetPacks().call();
};

export const getSelectedAssetPacksWithAssetData = (assetPackIds) =>
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

export const getAssetPacksWithAssetData = (optionalAssetPacks) =>
  new Promise(async (resolve, reject) => {
    let numOfPacks = optionalAssetPacks || await getNumberOfAssetPacks();
    let assetPackPromises = [];
    for (let i = 0; i < numOfPacks; i++) {
      assetPackPromises.push(await getAssetPackData(i));
    }
    Promise.all(assetPackPromises)
      .then(assetPacks => {
        console.log(assetPacks);
        resolve(assetPacks);
      })
      .catch(error => {
        reject(error);
      });
  });

export const getAssetPackData = async (assetPackId) => {
  let response = await assetManagerContract().methods.getAssetPackData(assetPackId).call();
  const packCoverIpfs = utils.getIpfsHashFromBytes32(response[0]);
  const creator = response[1];
  const price = response[2];
  const ids = response[3];
  const username = response[7];
  const userAvatar = utils.getIpfsHashFromBytes32(response[8]);
  let metadata;
  try {
    const metadataIpfs = await ipfsService.getFileContent(response[6]);
    metadata = JSON.parse(metadataIpfs);
  } catch (e) {
    metadata = {
      name: '',
      description: '',
    };
  }
  const assets = [];
  for (let i = 0; i < ids.length; i++) {
    let ipfsHash = utils.getIpfsHashFromBytes32(response[5][i]);
    assets.push({
      id: ids[i],
      attribute: response[4][i],
      ipfsHash: ipfsHash,
      src: `${ipfsNodePath}${ipfsHash}`
    });
  }
  return {
    packName: metadata.name,
    packDescription: metadata.description,
    packCoverIpfs,
    packCoverSrc: `${ipfsNodePath}${packCoverIpfs}`,
    creator,
    price: web3.utils.fromWei(price, 'ether'),
    id: assetPackId,
    assets,
    username,
    userAvatar,
  };
};

export const usernameExists = async (username) => {
  return await digitalPrintImageContract().methods.isUsernameExists(username).call();
};

export const getUsername = async (address) => {
  return await digitalPrintImageContract().methods.getUsername(address).call();
};

export const getAvatar = async (address) => {
  return await digitalPrintImageContract().methods.getProfilePicture(address).call();
};

export const registerUser = (username, hashToProfilePicture, account) =>
  new Promise(async (resolve, reject) => {
    if (!web3.utils.isAddress(account)) return;
    try {
      const transactionPromise = digitalPrintImageContract().methods.register(username, hashToProfilePicture).send({
        from: account
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Cannot register user');
    }
  });

export const isImageForSale = async (imageId) => {
  return await marketPlaceContract().methods.isImageOnSale(imageId).call();
};

export const cancelSell = (address, imageId) =>
  new Promise(async (resolve, reject) => {
    if (!web3.utils.isAddress(address)) return;
    try {
      const transactionPromise = marketPlaceContract().methods.cancel(imageId).send({
        from: address
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        // Resolve with a promise pointing to the sellImage method, so we can
        // handle both txHash and the finalized transaction
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Could not cancel image sale.');
    }
  });

export const buyImage = (address, imageId, price) =>
  new Promise(async (resolve, reject) => {
    if (!web3.utils.isAddress(address) && imageId < 0 && parseFloat(price) <= 0) return false;
    const buyPrice = web3.utils.toWei(price, 'ether');
    try {
      const transactionPromise = marketPlaceContract().methods.buy(imageId).send({
        from: address,
        value: buyPrice,
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        // Resolve with a promise pointing to the sellImage method, so we can
        // handle both txHash and the finalized transaction
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Could not buy image.');
    }
  });

export const sellImage = (address, imageId, price) =>
  new Promise(async (resolve, reject) => {
    if (!web3.utils.isAddress(address) && imageId < 0 && parseFloat(price) <= 0) return false;
    const sellPrice = web3.utils.toWei(price, 'ether');
    try {
      const transactionPromise = marketPlaceContract().methods.sell(imageId, sellPrice).send({
        from: address,
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        // Resolve with a promise pointing to the sellImage method, so we can
        // handle both txHash and the finalized transaction
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Could not sell image.');
    }
  });

export const calculatePrice = async (pickedAssets, owner) => {
  if (pickedAssets.length === 0) {
    return 0;
  }

  if (!web3.utils.isAddress(owner)) {
    return null;
  }

  return await digitalPrintImageContract().methods.calculatePrice(pickedAssets, owner).call();
};

// Function to get total number of assets existing on contract
export const getNumberOfAssets = async () => {
  return await assetManagerContract().methods.getNumberOfAssets().call();
};

export const getGalleryImages = async (imageIds, getPrice) => {
  const promises = imageIds.map(async imageId => await getGalleryImage(imageId, getPrice));
  return Promise.all(promises);
};

export const getImageCount = async () => {
  return await digitalPrintImageContract().methods.totalSupply().call();
};

export const getImagesOnSale = () => marketPlaceContract().methods.getActiveAds().call();

export const getImagePrice = async (imageId) => {
  const marketplaceAd = await marketPlaceContract().methods.sellAds(imageId).call();
  return marketplaceAd.active ? web3.utils.fromWei(marketplaceAd.price, 'ether') : 0;
};

export const getCreatedGraphics = async (address) => {
  return await getterContract().methods.getImagesCreatedByAddress(address).call();
}

export const getGalleryImage = async (imageId, getPrice) =>
  new Promise(async (resolve, reject) => {
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
      const metadataIpfs = await ipfsService.getFileContent(image[5]);
      metadata = JSON.parse(metadataIpfs);
    } catch (e) {
      console.error('Error getting ipfs metadata for image with ID: ', imageId);
      console.error(e);
    }
    const hasFrame = parseInt(metadata.frame) === 1;
    const initialAvatar = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const userAvatar = (image[3] === initialAvatar) ? DEFAULT_AVATAR : `${ipfsNodePath}${utils.getIpfsHashFromBytes32(image[3])}`;
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

export const getImageOwnerAndCreator = async (imageId) => ({
  ...(await digitalPrintImageContract().methods.getGalleryData(imageId).call()),
  id: imageId
});

export const getImageMetadata = (imageId) =>
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
        potentialAssets: utils.decode(potentialAssets),
        usedAssetsBytes: potentialAssets,
        usedAssets: pickedAssets,
        timestamp: imageMetadata[4],
        usedAssetsInfo,
      });
    } catch (err) {
      reject(err);
    }
  });

export const getUserImages = async (address) => {
  if (address.length !== 42) {
    return -1;
  }
  return await digitalPrintImageContract().methods.getUserImages(address).call();
};

export const convertSeed = async (randomSeed) => {
  return await functionsContract().methods.toHex(randomSeed).call();
};

export const calculateFirstSeed = async (timestamp, rands) => {
  return await functionsContract().methods.calculateSeed(rands, timestamp).call();
};

export const calculateSeed = (random_seed, x) => {
  return web3.utils.soliditySha3(random_seed, x);
};

export const calculateFinalSeed = (random_seed, iterations) => {
  let seed = web3.utils.soliditySha3(random_seed, iterations);
  for (let i = 0; i < iterations; i++) {
    seed = web3.utils.soliditySha3(seed, i);
  }
  return seed;
};

export const getAssetMetadata = (seed, assetId) => {
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

export const getAssetsOrigins = async (assetIds) => {
  const assetPacks = await assetManagerContract().methods.pickUniquePacks(assetIds).call();
  const onlyUnique = [...new Set(assetPacks)];

  return onlyUnique;
};

export const getImage = async (randomSeed, iterations, potentialAssets, finalSeed) => {
  let seed = finalSeed || calculateFinalSeed(randomSeed, iterations);
  let pickedAssets = [];
  let attributes = await getAttributesForAssets(potentialAssets);

  for (let i = 0; i < potentialAssets.length; i++) {
    seed = web3.utils.soliditySha3(seed, parseInt(potentialAssets[i], 10));
    let metadata = getAssetMetadata(utils.hex2dec(seed), potentialAssets[i]);

    if (metadata !== null) {
      pickedAssets.push({
        ...metadata,
        attributes: attributes[i],
      });
    }
  }
  return pickedAssets;
};

export const getTestImage = async (randomSeed, iterations, potentialAssets) => {
  let seed = calculateFinalSeed(randomSeed, iterations);
  console.log('POTENTIAL', potentialAssets);
  let pickedAssets = [];

  for (let i = 0; i < potentialAssets.length; i++) {
    seed = web3.utils.soliditySha3(seed, parseInt(i, 10));
    let metadata = getAssetMetadata(utils.hex2dec(seed), i);

    if (metadata !== null) {
      pickedAssets.push({
        ...metadata,
        attributes: potentialAssets[i].attribute,
        uploadSrc: potentialAssets[i].path
      });
    }
  }
  console.log('PICKED ASSETS', pickedAssets);
  return pickedAssets;
};

export const getAssetStats = async (id) => {
  let numberOfAssets = await assetManagerContract().methods.getNumberOfAssets().call();
  numberOfAssets = parseInt(numberOfAssets, 10);
  let layer = Math.floor(Math.random() * 10);
  if (id >= numberOfAssets) {
    return null;
  } else {
    let info = await assetManagerContract().methods.getAssetInfo(id).call();
    return {
      id: parseInt(info[0], 10),
      pack_id: parseInt(info[1], 10),
      attributes: info[2],
      ipfsHash: info[2],
    };
  }
};

export const getAssetInfo = async id => {
  let info = await assetManagerContract().methods.getAssetInfo(id).call();
  return info;
};

export const getPositionsOfAssetsInImage = async (finalSeed, potentialAssets, width, height) => {
  // Hardcoded width & height because contract always uses 2:3 aspect
  return await functionsContract().methods.getImage(finalSeed, potentialAssets, 2480, 3508).call();
};

export const getBoughtAssets = async () => {
  return [];
};

export const getLandingPacks = () => {
  const ids = landingAssetPacks.map(item => item.id);
  const assetIds = landingAssetPacks.map(assetPack =>
    assetPack.assets.map(item => parseInt(item.id)))
    .reduce((a, b) => a.concat(b), []);
  return {
    packs: landingAssetPacks,
    ids,
    assetIds,
  };
};

export async function parseContractAssetData(image) {
  const assets = await getPositionsOfAssetsInImage(image.finalSeed, image.usedAssetsBytes, image.width, image.height);
  let ids = assets['finalPicked'];
  let background = await getAttributesForAssets(ids);
  let parsedAssets = [];
  for (let i = 0; i < ids.length; i++) {
    if (!parsedAssets[i]) parsedAssets[i] = {};
    parsedAssets[i]['x_coordinate'] = parseInt(assets['x'][i], 10);
    parsedAssets[i]['y_coordinate'] = parseInt(assets['y'][i], 10);
    parsedAssets[i]['layer'] = parseInt(assets['layers'][i], 10);
    parsedAssets[i]['scale'] = parseInt(assets['zoom'][i], 10);
    parsedAssets[i]['rotation'] = parseInt(assets['rotation'][i], 10);
    parsedAssets[i]['id'] = ids[i];
    parsedAssets[i]['attributes'] = background[i];
  }
  parsedAssets = parsedAssets.sort(layerCompare);
  return parsedAssets;
}

const mapUserInfo = userInfoTx => {
  const username = userInfoTx[0] || DEFAULT_USERNAME;

  const isImageEmptyBytes = utils.isEmptyBytes(userInfoTx[1]);
  const avatar = isImageEmptyBytes ? DEFAULT_AVATAR : `${ipfsNodePath}${utils.getIpfsHashFromBytes32(userInfoTx[1])}`;

  return { username, avatar };
};

export const getUserInfo = address =>
  new Promise(async (resolve, reject) => {
    try {
      const userContract = await digitalPrintImageContract();
      const res = await userContract.methods.getUserInfo(address).call();

      resolve(mapUserInfo(res));
    } catch (err) {
      reject(err);
    }
  });

export const getImageTransferHistory = imageId =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = await marketPlaceContract();
      const userContract = await digitalPrintImageContract();

      const events = await contract.getPastEvents('ImageBought', {
        filter: { imageId },
        fromBlock: clientConfig.deployBlockNumber
      });

      const prices = events.map(event => web3.utils.fromWei(event.returnValues[2], 'ether'));

      // get time from the events tx block numbers
      const eventTimestampsPromise = events.map(event => web3.eth.getBlock(event.blockNumber));
      const eventsBlocks = await Promise.all(eventTimestampsPromise);
      const eventsTimes = eventsBlocks.map(block => utils.timeConverter(block.timestamp));

      // get users name and images from the events
      const usersAddresses = events.map(event => event.returnValues[1]);
      const usersPromise = usersAddresses.map(address => userContract.methods.getUserInfo(address).call());
      const usersInfoTxs = await Promise.all(usersPromise);
      const usersInfo = usersInfoTxs.map(mapUserInfo);

      const data = usersInfo.map((userInfo, index) => ({
        ...userInfo,
        buyerAddress: usersAddresses[index],
        time: eventsTimes[index],
        price: prices[index],
      }));

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

export const userBalances = async (address) => {
  console.log('Fetching balance for ', address);
  const assetBalance = await assetManagerContract().methods.artistBalance(address).call();
  const marketplaceBalance = await marketPlaceContract().methods.balances(address).call();
  console.log(assetBalance, marketplaceBalance);
  return { assetBalance, marketplaceBalance };
};

export const fromWei = (value, decimals) => {
  let eth = value;
  if (decimals) {
    const dec = web3.utils.toWei((10 ** (-decimals)).toString(), 'ether');
    eth = Math.floor(eth / dec) * dec;
  }
  eth = web3.utils.fromWei(eth.toString(), 'ether');
  return eth;
};

export const withdraw = (fromCt, address) =>
  new Promise(async (resolve, reject) => {
    const ct = fromCt === 'marketplace'
      ? marketPlaceContract()
      : assetManagerContract();
    const account = await getAccounts();
    const transactionPromise = ct.methods.withdraw().send({ from: account },
      (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        resolve(() => transactionPromise);
      });
  });

export const sendETHtoAddress = (from, to, value) => {
  try {
    web3.eth.sendTransaction({
      from,
      to,
      value: web3.utils.toWei(value, 'ether')
    });
  } catch (err) {
    console.log(err);
  }
};