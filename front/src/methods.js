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
  timestamp = parseInt(timestamp,10);
  iterations = parseInt(iterations,10);
  try {
    console.log(randomHashIds, timestamp, iterations, potentialAssets, author, ipfsHash, price);
    return await digitalPrintImageContract.methods.createImage(randomHashIds, timestamp, iterations, potentialAssets, author, ipfsHash).send({
      value: price.toString(),
      from: account,
      to: digitalPrintImageContractAddress,
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create image');
  }
}

async function createAsset(attributes,  ipfsHash, price, account) {
  console.log('Price: ' + price);
  console.log('Ipfs hash: ' + ipfsHash);
  console.log('Attributes: ' + attributes);
  console.log('Account: ' + account);

  let nonce = await web3.eth.getTransactionCount(account);
  try {
    return await assetManagerContract.methods.createAsset(attributes, ipfsHash, price).send({
      from: account, to: assetManagerContract, nonce
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create asset');
  }
}

async function createAssetPack(name, attributes, ipfsHashes, price, account) {
  try {
      let nonce = await web3.eth.getTransactionCount(account);
      return await assetManagerContract.methods.createAssetPack(name, attributes, ipfsHashes, price).send({
        from: account, to: assetManagerContract, nonce
    }, (a,b) => {
      console.log(a,b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create asset pack');
  }
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

    width = (height * 10) / 14;

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

async function makeImage(objs, c, width, height, frame = { left: 0, right: 0, bottom: 0, top: 0 }) {
  let context = c.getContext('2d');
  const { left, right, bottom, top } = frame;
  const canvasHeight = height;
  const canvasWidth = width;
  width = width - left - right;
  height = height - top - bottom;
  context.clearRect(0, 0, width, height);
  let ids = [];
  for(let j=0; j<objs.length; j++) {
    //ids -1 because on contract goes from 0
      ids.push(objs[j].id -1);
  }
  let hashes = await functions.getAssetsIpfs(ids);
  let images = [];
  for (let i = 0; i < objs.length; i++) {
    console.log(objs[i].id + " hash : " + hashes[i]);
    let image = new Image();
    let val = objs[i].id;
    if (val < 10) {
      val = '0' + val;
    }

    // let src = await assetManagerContract.methods.getAssetIpfs(objs[i].id).call();
    image.src = "http://ipfs.decenter.com/ipfs/" + hashes[i];
    // image.src = require('../dist/assets/' + val + '.png');
      image.crossOrigin = "Anonymous";

      images.push(image);
  }


  let imagesLoaded = 0;

  for (let j = 0; j < objs.length; j++) {
    images[j].onload = function () {
      imagesLoaded++;
      let x = objs[j].x_coordinate % canvasWidth;
      let y = objs[j].y_coordinate % canvasHeight;
      let rotation = objs[j].rotation;
      drawImageRot(context, images[j], x, y, width / 4, height / 4, rotation);
      if (imagesLoaded === objs.length && frame.left > 0) {
        // WRITE FRAME
        context.strokeStyle = '#FFF';
        context.beginPath();
        context.moveTo(left / 2, 0);
        context.lineWidth = left;
        context.lineTo(left / 2, canvasHeight);
        context.stroke();

        context.beginPath();
        context.moveTo(0, canvasHeight - bottom / 2);
        context.lineWidth = bottom;
        context.lineTo(canvasWidth, canvasHeight - bottom / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(canvasWidth - right / 2, canvasHeight);
        context.lineWidth = right;
        context.lineTo(canvasWidth - right / 2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(canvasWidth, top / 2);
        context.lineWidth = top;
        context.lineTo(0, top / 2);
        context.stroke();
      }
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
  // let x = await loadDataForAssets();
  // console.log(x);
    ipfsHashes = [ 'QmUJeMmc2jETHdTUfCQyK27bMhSfoAFfRpQuX5RpVN2gHf',
        'QmQKJdkbGEsiav3vdzK8pTH5WoNXCoXN8VbZLrFoWjmPwR',
        'Qmd9VNGsVST4y4ZLz5rQtLMxDb2HhJwutAfQ5Et5MoAA7z',
        'QmaL8YXHZA2aayApzaAeeV7RDJXAf5ZvqCbPraQkgdkTSh',
        'QmPNSue3FwTVeYsYrDtMBPWWofFQCtP72C3m8vtYS3xEAu'];

    for (let i=0; i<ipfsHashes.length; i++){
      ipfsHashes[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
    }
    console.log(ipfsHashes);
    await createAssetPack(ipfsHashes, 2000, '0xf67cDA56135d5777241DF325c94F1012c72617eA');
}

// test();

module.exports = {
  getData,
  loadDataForAssets,
  makeImage,
  createImage,
  createAsset,
  createAssetPack,
  getSize,
};