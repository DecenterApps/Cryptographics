const functions = require('../scripts/functions');
const utils = require('../scripts/utils');
const conf = require('../scripts/config.json');
const Web3 = require('web3');

// const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.decenter.com'));

const web3 = new Web3(window.web3.currentProvider);

const digitalPrintImageContractAddress = conf.digitalPrintImageContract.networks['42'].address;
const digitalPrintImageContract = new web3.eth.Contract(conf.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const assetManagerContractAddress = conf.assetManagerContract.networks['42'].address;
const assetManagerContract = new web3.eth.Contract(conf.assetManagerContract.abi, assetManagerContractAddress);

async function createImage(randomHashIds, timestamp, iterations, potentialAssets, author, account, price, ipfsHash) {
  potentialAssets = utils.encode(potentialAssets);
  console.log('ENCODED POTENTIAL ASSETS: ' + potentialAssets);
  let nonce = await web3.eth.getTransactionCount(account);
  try {
    console.log(randomHashIds, timestamp, iterations, potentialAssets, author);
    return await digitalPrintImageContract.methods.createImage(randomHashIds, timestamp, iterations, potentialAssets, author, ipfsHash).send({
      value: web3.utils.toWei(price.toString(), 'wei'),
      from: account,
      to: digitalPrintImageContractAddress,
      nonce: nonce
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create image');
  }
}

async function createAsset(price, ipfsHash, account) {
  console.log('Price: ' + price);
  console.log('Ipfs hash: ' + ipfsHash);
  console.log('Account: ' + account);

  let nonce = await web3.eth.getTransactionCount(account);
  try {
    return await assetManagerContract.methods.createAsset(ipfsHash, price).send({
      from: account, to: assetManagerContract, nonce
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create asset');
  }
}

function merge_objects(obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

async function getNumberOfAss() {
  let assets = await functions.getNumberOfAssets();
  return assets;
}

async function loadDataForAssets() {
  return new Promise(async (resolve, reject) => {
    let assets = parseInt(await getNumberOfAss(), 10);
    console.log(assets);
    const promises = [];
    for (let i = 0; i < assets; i++) {
      console.log('loading');
      let promise = functions.getAssetStats(i);
      promises.push(promise);
    }

    Promise.all(promises)
      .then((data) => {
        resolve(data);
        console.log('all data ');
        console.log(data);
      })
      .catch((err) => {
        reject(new Error('Couldn\'t load all data.'));
      });
  });
}

function getSize(width, height, ratio) {
  const MAX_HEIGHT = 550;
  if (ratio === '1:1') {
    if (height > MAX_HEIGHT) height = 550;
    return { width: height, height };
  }
  if (ratio === '2:3') {
    if (height > MAX_HEIGHT) height = 550;

    width = (height * 2) / 3;

    return { width: width, height };
  }
}

async function getData(randomSeed, iterations, potentialAssets, allAssets) {
  console.log(randomSeed);
  let assets = functions.getImage(randomSeed, iterations, potentialAssets);
  var allDataAboutAsset = [];
  for (let i = 0; i < assets.length; i++) {
    let stats = allAssets[assets[i]];
    let final = { ...assets[i], ...stats };
    allDataAboutAsset.push(final);
  }
  return allDataAboutAsset;

}

function makeImage(objs, c, width, height) {
  let context = c.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.strokeRect(0, 0, width, height);
  let images = [];
  for (let i = 0; i < objs.length; i++) {
    let image = new Image();
    let val = objs[i].id;
    if (val < 10) {
      val = '0' + val;
    }
    image.src = '../dist/assets/' + val + '.png';

    images.push(image);
  }

  for (let j = 0; j < objs.length; j++) {
    images[j].onload = function () {
      let x = objs[j].x_coordinate % width;
      let y = objs[j].y_coordinate % height;
      let rotation = objs[j].rotation;

      drawImageRot(context, images[j], x, y, width / 4, height / 4, rotation);
    };
  }

}

function drawImageRot(context, img, x, y, width, height, deg) {
  //Convert degrees to radian
  var rad = deg * Math.PI / 180;

  //Set the origin to the center of the image
  context.translate(x, y);

  //Rotate the canvas around the origin
  context.rotate(rad);

  //draw the image
  context.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);

  //reset the canvas
  context.rotate(rad * (-1));

  //
  context.translate((x) * (-1), (y) * (-1));
}

// let randomSeed = 123123;
// let iterations = 5;
// let potentialAssets = [1,2,3,4,5,6,7,8,9,10,11];
// potentialAssets = utils.encode(potentialAssets);

async function test() {
  let x = await loadDataForAssets();
  console.log(x);
}

test();

module.exports = {
  getData,
  loadDataForAssets,
  makeImage,
  createImage,
  createAsset,
  getSize,
};