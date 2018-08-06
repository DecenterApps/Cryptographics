import { BigNumber } from 'bignumber.js';
import utils from 'services/utils';
import leftPad from 'left-pad';
import config from 'config/config.json';
import landingAssetPacks from 'config/landingAssetPacks.json';

// const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`));

const assetManagerContractAddress = config.assetManagerContract.networks['42'].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks['42'].address;
const digitalPrintImageContract = () => new web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

// Function to pick ten random integers [0,99]
// Will be executed during generating initial random seed
export const pickTenRandoms = () => {
  let randoms = [];
  for (let i = 0; i < 10; i++) {
    randoms.push(Math.floor(Math.random() * 100));
  }
  return randoms;
};

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
  console.log(ipfsHashes);
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

export const getPaginatedAssetPacks = async (pagination, count, address) => {
  let assetPacksIds = await assetManagerContract().methods.getAssetPacksUserCreated(address).call();
  let beginning = (pagination - 1) * count;
  let end = pagination + count - 1;
  return assetPacksIds.slice(beginning, end);
};

export const getCoversForAssetPacks = async (assetPackIds) => {
  let hovers = await assetManagerContract().methods.getCoversForPacks(assetPackIds).call();
  for (let i = 0; i < hovers.length; i++) {
    hovers[i] = utils.getIpfsHashFromBytes32(hovers[i]);
  }
  return hovers;
};

export const getPackInformation = async (assetPacksIds, account) => {
  let srcs = await getCoversForAssetPacks(assetPacksIds);
  let names = await getAssetPacksNames(assetPacksIds);
  let data = [];
  for (let i = 0; i < srcs.length; i++) {
    data.push({
      name: names[i],
      src: 'https://ipfs.decenter.com/ipfs/' + srcs[i],
    });
  }
  return data;
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

export const getAssetPackData = async (assetPackId) => {
  let response = await assetManagerContract().methods.getAssetPackData(assetPackId).call();
  let ids = response[1];
  let data = [];
  for (let i = 0; i < ids.length; i++) {
    data.push({
      pack_name: response[0],
      id: response[1][i],
      attribute: response[2][i],
      ipfsHash: utils.getIpfsHashFromBytes32(response[3][i]),
    });
  }
  return data;
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

export const registerUser = async (username, hashToProfilePicture, account) => {
  try {
    console.log(account);
    return await digitalPrintImageContract().methods.register(username, hashToProfilePicture).send({
      from: account
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot register user');
  }
};

export const calculatePrice = async (pickedAssets, owner) => {
  if (pickedAssets.length === 0) {
    return 0;
  }

  if (owner.toString().length !== 42) {
    return null;
  }

  return await digitalPrintImageContract().methods.calculatePrice(pickedAssets, owner).call();
};

// Function to get total number of assets existing on contract
export const getNumberOfAssets = async () => {
  return await assetManagerContract().methods.getNumberOfAssets().call();
};

export const getUserImages = async (address) => {
  if (address.length !== 42) {
    return -1;
  }
  return await digitalPrintImageContract().methods.getUserImages(address).call();
};

export const getImageMetadataFromContract = async (image_id) => {
  if (image_id < 0) {
    return null;
  }
  let imageMetadata = await digitalPrintImageContract().methods.getImageMetadata(image_id).call();
  imageMetadata[0] = await convertSeed(imageMetadata[0]);
  return imageMetadata;
};

export const convertSeed = async (randomSeed) => {
  return await digitalPrintImageContract().methods.toHex(randomSeed).call();
};

// Function to calculate first random seed, it will be executed from contract

export const calculateFirstSeed = async (timestamp, rands) => {
  return await digitalPrintImageContract().methods.calculateSeed(rands, timestamp).call();
};

// Function to calculate keccak256 when input is (int and int)
// INTEGRATED WITH CONTRACT
export const calculateSeed = (random_seed, x) => {
  return web3.utils.soliditySha3(random_seed, x);
};

// Function to calculate final seed for input (random_seed -int & iterations-int)
// INTEGRATED WITH CONTRACT
export const calculateFinalSeed = (random_seed, iterations) => {
  let seed = web3.utils.soliditySha3(random_seed, iterations);
  for (let i = 0; i < iterations; i++) {
    seed = web3.utils.soliditySha3(seed, i);
  }
  return seed;
};

//Function to get metadata for asset based on random seed and assetId
//seed - bytes32 ; assetId - integer
export const getAssetMetadata = (seed, assetId) => {
  seed = seed.toString();
  let number = new BigNumber(seed);
  // If number can be divided by 2 means that asset will be included into image
  if (parseInt(number.modulo(2), 10) === 0) {
    let id = assetId;
    let x_coordinate = parseInt(number.modulo(2480), 10);
    let y_coordinate = parseInt(number.modulo(3508), 10);
    let zoom = parseInt(number.modulo(200), 10) + 800;
    let rotation = parseInt(number.modulo(360), 10);
    let layer = parseInt(number.modulo(1234567), 10);
    return {
      id: id,
      x_coordinate: x_coordinate,
      y_coordinate: y_coordinate,
      zoom: zoom,
      rotation: rotation,
      layer: layer
    };
  }
  return null;
};

//INTEGRATED WITH CONTRACT - function to getImage info
//(bytes32, uint, bytes32)
export const getImage = async (randomSeed, iterations, potentialAssets) => {
  let seed = calculateFinalSeed(randomSeed, iterations);
  console.log("FINAL SEED: ", seed);
  let pot_assets = [];
  console.log(potentialAssets.length);
  for (let j = 0; j < potentialAssets.length; j++) {
    let arr = [];
    arr.push(potentialAssets[j]);
    // pot_assets.push(utils.decode(arr).reverse());
    pot_assets = [...pot_assets, ...utils.decode(arr)];
  }
  // var pot_assets = utils.decode(potentialAssets).reverse();
  console.log('POTENTIAL', pot_assets);
  let pickedAssets = [];
  let attributes = await getAttributesForAssets(pot_assets);
  console.log('ATTRIBUTES', attributes);

  for (let i = 0; i < pot_assets.length; i++) {
    seed = web3.utils.soliditySha3(seed, parseInt(pot_assets[i], 10));
    let metadata = getAssetMetadata(utils.hex2dec(seed), pot_assets[i]);

    if (metadata != null) {
      pickedAssets.push({
        ...metadata,
        background: attributes[i],
      });
    }
  }
  console.log('PICKED ASSETS', pickedAssets);
  return pickedAssets;
};

//Function to get data from contract for every asset (id,creator, ipfsHash, and price) - based on asset id
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

export const getPositionsOfAssetsInImage = async (finalSeed, potentialAssets) => {
  return await digitalPrintImageContract().methods.pickRandomAssets(finalSeed, potentialAssets).call();
};

export const getBoughtAssets = async () => {
  // TODO: Implement missing method
  return [];
};

export const getLandingPacks = () => {
  const ids = landingAssetPacks.map(item => item.id);
  return {
    packs: landingAssetPacks,
    ids,
  };
};

async function test() {
  // assets = getImage("0x0de5ac0773fa76034fd9fdcfbd8f8b96377fd2d0057ed6d0080afd3434b91636",5, ["0x000000000100000200000300000400000500000600000700000800000900000a", "0x000000000000000000000000000000000000000000000000000000000000000b"]);
  // printImageData(assets);
  // console.log(getAssetMetadata("0x123f12ddd3ffaa",5));
  // getImageMetadataFromContract(0);
  // let ipfs = await getAssetIpfs(5);
  // console.log("DECODED : " + utils.getIpfsHashFromBytes32(ipfs));

  // console.log(await getCreatedAssetPacks("0xf67cDA56135d5777241DF325c94F1012c72617eA"));
  // console.log(await getAssetPackData(0));
  // console.log(await getAssetPackData(5));
  // console.log(await getPackInformation([1,2,3],"0xf67cDA56135d5777241DF325c94F1012c72617eA"));
  // await getImageMetadataFromContract(0);
  await getPositionsOfAssetsInImage('0x240610f366b57b4546eeaaa4de0e441613c1412f0b7f6689e1f19e858f056925',
    ['0x0000000000000001000002000003000004000005000006000007000008000009', '0x000000000a00000b00000c00000d00000e00000f000010000011000012000013',
      '0x000000001400001500001600001700001800001900001a00001b00001c00001d',
      '0x000000001e00001f000020000021000022000023000024000025000026000027']);
  // await getAttributesForAssets([1,2,3,4]);
}

function printImageData(assets) {
  for (let i = 0; i < assets.length; i++) {
    let obj = assets[i];
  }
}

// test();