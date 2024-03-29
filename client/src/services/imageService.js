import {
  getNumberOfAssets,
  getAssetStats,
  getImage,
  getAssetsIpfs,
} from 'services/ethereumService';

import utils from 'services/utils';
import config from 'config/config.json';
import clientConfig from 'config/clientConfig.json';
import { ipfsNodePath } from 'config/constants';
import * as helpers from 'services/helpers';
import { preloadImages } from './helpers';

const digitalPrintImageContractAddress = config.digitalPrintImageContract.networks[clientConfig.network].address;
const digitalPrintImageContract = () => new window._web3.eth.Contract(config.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

const assetManagerContractAddress = config.assetManagerContract.networks[clientConfig.network].address;
const assetManagerContract = () => new window._web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const DELAY = 150;

export const createImage = (randomHashIds, timestamp, iterations, potentialAssets, author, account, price, ipfsHash, extraData) =>
  new Promise(async (resolve, reject) => {
    potentialAssets = utils.encode(potentialAssets);

    timestamp = parseInt(timestamp, 10);
    iterations = parseInt(iterations, 10);
    try {
      console.log(randomHashIds, timestamp, iterations, potentialAssets, author, ipfsHash, price);
      const transactionPromise = digitalPrintImageContract().methods.createImage(
        randomHashIds,
        timestamp,
        iterations,
        potentialAssets,
        author,
        ipfsHash,
        extraData,
      ).send({
        value: utils.scientificToDecimal(parseInt(price)),
        from: account,
        to: digitalPrintImageContractAddress,
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        // Resolve with a promise pointing to the createImage method, so we can
        // handle both txHash and the finalized transaction
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Cannot create image');
    }
  });

export const createAsset = async (attributes, ipfsHash, price, account) => {
  console.log('Price: ' + price);
  console.log('Ipfs hash: ' + ipfsHash);
  console.log('Attributes: ' + attributes);
  console.log('Account: ' + account);

  try {
    return await assetManagerContract().methods.createAsset(attributes, ipfsHash, price).send({
      from: account
    }, (a, b) => {
      console.log(a, b);
    });
  } catch (e) {
    console.log(e);
    throw new Error('Cannot create asset');
  }
};

export const createAssetPack = (coverImage, attributes, ipfsHashes, price, account, metadataIpfsHash) =>
  new Promise((resolve, reject) => {
    try {
      const transactionPromise = assetManagerContract().methods.createAssetPack(
        coverImage,
        attributes,
        ipfsHashes,
        window._web3.utils.toWei(price),
        metadataIpfsHash,
      ).send({
        from: account
      }, (error, txHash) => {
        console.log(error, txHash);
        if (error) return reject(new Error(error));
        // Resolve with a promise pointing to the createImage method, so we can
        // handle both txHash and the finalized transaction
        resolve(() => transactionPromise);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Cannot create asset pack');
    }
  });

export const loadDataForAssets = async () => {
  return new Promise(async (resolve, reject) => {
    let assets = parseInt(await getNumberOfAssets(), 10);
    const promises = [];
    for (let i = 0; i < assets; i++) {
      let promise = getAssetStats(i);
      promises.push(promise);
    }

    Promise.all(promises)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(new Error('Couldn\'t load all data.'));
      });
  });
};

export const getSize = (width, height, ratio) => {
  const MAX_HEIGHT = 3508;
  const MAX_WIDTH = 2480;
  if (ratio === '1:1') {
    if (height > MAX_WIDTH) height = MAX_WIDTH;
    return {
      width: height,
      height,
      canvasWidth: MAX_WIDTH,
      canvasHeight: MAX_WIDTH,
    };
  }
  if (ratio === '2:3') {
    if (height > MAX_HEIGHT) height = MAX_HEIGHT;

    width = (height * 10) / 14;

    return {
      width: width,
      height,
      canvasWidth: MAX_WIDTH,
      canvasHeight: MAX_HEIGHT,
    };
  }
};

export function layerCompare(a, b) {
  if (a.layer < b.layer || (a.layer == b.layer && a.id < b.id)) {
    return -1;
  }

  if (a.layer > b.layer || (a.layer == b.layer && a.id > b.id)) {
    return 1;
  }

  return 0;
}

export const getFinalAssets = async (randomSeed, iterations, potentialAssets, allAssets) => {
  console.log(randomSeed);
  let assets = await getImage(randomSeed, iterations, potentialAssets);
  assets = assets.sort(layerCompare);
  console.log('assets after', assets);
  let allDataAboutAsset = [];
  for (let i = 0; i < assets.length; i++) {
    let stats = allAssets[assets[i]];
    let final = { ...assets[i], ...stats };
    allDataAboutAsset.push(final);
  }
  return allDataAboutAsset;
};

const drawFrame = (context, canvasHeight, canvasWidth, frame) => {
  const { left, right, bottom, top } = frame;

  context.strokeStyle = '#FFF';
  context.beginPath();
  context.moveTo(left / 2, 0);
  context.lineWidth = left;
  context.lineTo(left / 2, canvasHeight);
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
};

const drawBottomFrame = (context, canvasHeight, canvasWidth, frame) =>
  new Promise((resolve) => {
    let { bottom, left, finalFrameData } = frame;

    const centerOfBottomFrame = canvasHeight - bottom / 2;

    context.strokeStyle = '#FFF';
    context.beginPath();
    context.moveTo(0, centerOfBottomFrame);
    context.lineWidth = bottom;
    context.lineTo(canvasWidth, centerOfBottomFrame);
    context.stroke();

    if (finalFrameData) {
      drawPersonalizedData(context, canvasHeight, canvasWidth, frame, centerOfBottomFrame);
      return resolve();
    }

    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = require(`assets/cg-logo.png`);

    image.onload = () => {
      const verticalAlign = canvasHeight - bottom / 2 - image.height / 2;

      context.drawImage(image, left, verticalAlign, image.width, image.height);
      resolve();
    };
    image.onerror = (err) => console.error(err);
  });

const drawLoadedImage = async (context, asset, canvasWidth, canvasHeight, frame, index, delayTime) => {
  let x = asset.x_coordinate % canvasWidth;
  let y = asset.y_coordinate % canvasHeight;
  let { rotation, scale, isBackground, shouldScale, shouldRotate } = asset;
  if (delayTime > 0) {
    await delay(delayTime);
  }
  drawImageRot(
    context,
    asset.image,
    x,
    y,
    asset.image.width,
    asset.image.height,
    rotation,
    scale,
    {
      isBackground,
      shouldScale,
      shouldRotate,
      canvasWidth,
      canvasHeight
    });
};

export const drawPersonalizedData = (context, canvasHeight, canvasWidth, frame, centerOfBottomFrame) => {
  let { bottom, left, right, finalFrameData } = frame;
  const posXRight = canvasWidth - right;
  const positionY = (canvasHeight - bottom) + left;
  const titleText = '40px YoungSerif-Regular';
  const regularText = '30px Roboto';
  const textOffset = 55;
  context.textBaseline = 'top';
  context.textAlign = 'left';
  context.font = titleText;
  context.fillStyle = '#000';
  context.fillText(finalFrameData.title, left, positionY);
  context.font = regularText;
  context.fillText(`no.${utils.padToFour(parseInt(finalFrameData.id))}`, left, positionY + textOffset);

  context.textAlign = 'right';
  context.font = titleText;
  context.fillText(finalFrameData.creatorMeta.username, posXRight, positionY);
  const offset = context.measureText(finalFrameData.creatorMeta.username).width;
  context.font = regularText;
  context.fillText('Cryptographic by  ', posXRight - offset, positionY + 12);
  context.fillText(finalFrameData.creator, posXRight, positionY + textOffset);
};

export const makeCoverImage = (isHome, assets, c, width, height, frame = {
  left: 0,
  right: 0,
  bottom: 0,
  top: 0
}) => {
  let context = c.getContext('2d');
  const { left, right, bottom, top } = frame;
  const canvasHeight = height;
  const canvasWidth = width;
  console.log(canvasHeight, canvasWidth);
  width = width - left - right;
  height = height - top - bottom;
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  let images = [];
  for (let i = 0; i < assets.length; i++) {
    let image = new Image();
    let attribute = parseInt(assets[i].attribute);

    image.src = assets[i].path;
    image.crossOrigin = 'Anonymous';
    if (Math.ceil((Math.random() * 10) ** 8) % 2 === 0) {
      images.push({
        id: i,
        image: image,
        x_coordinate: Math.floor(Math.random() * canvasWidth),
        y_coordinate: Math.floor(Math.random() * canvasHeight),
        rotation: Math.floor((attribute / 10) % 10) === 1 ? Math.floor(Math.random() * 360) : 0,
        scale: Math.floor(attribute % 10) === 1 ? 800 + Math.floor(Math.random() * 200) : 1000,
        isBackground: Math.floor((attribute / 100) % 10) === 1,
        shouldScale: true,
        shouldRotate: true,
      });
    }
  }

  images = helpers.shuffleArray(images);
  images = helpers.moveBackgrounds(images);

  preloadImages(images)
    .done(async (loadedImages) => {
      for (let i = 0; i < images.length; i++) {
        await drawLoadedImage(context, images[i], canvasWidth, canvasHeight, frame, i, 0);
      }
    });
};

const delay = async (delayInms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
};

export const scaleImage = (width, height, canvasWidth, canvasHeight, ratio) => {
  const DEFAULT_WIDTH = 2480;
  const DEFAULT_HEIGHT = 1805;

  const horizontalRatio = DEFAULT_WIDTH / canvasWidth;
  const verticalRatio = DEFAULT_HEIGHT / canvasHeight;

  return {
    width: width / horizontalRatio,
    height: height / verticalRatio,
  };
};

export const makeImage = (objs, c, width, height, frame = {
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  ratio: '2:3'
}, delay = DELAY) =>
  new Promise(async (resolve, reject) => {
    let hashes;
    let assets = objs.slice();
    let context = c.getContext('2d');
    const { left, right, bottom, top } = frame;
    const canvasHeight = height;
    const canvasWidth = width;
    width = width - left - right;
    height = height - top - bottom;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    console.log('Number of assets ' + assets.length);
    if (assets.length === 0) {
      await drawBottomFrame(context, canvasHeight, canvasWidth, frame);

      if (frame.shouldDrawFrame) {
        // DRAW FRAME
        drawFrame(context, canvasHeight, canvasWidth, frame);
      }
      return resolve('No assets provided.');
    }

    if (!assets[0].src && !assets[0].uploadSrc) {
      try {
        hashes = await getAssetsIpfs(assets);
      } catch (e) {
        console.info(e);
        return resolve('Could not get ipfs hashes for assets');
      }
    }

    for (let i = 0; i < objs.length; i++) {
      let image = new Image();
      image.crossOrigin = 'Anonymous';

      if (assets[i].src) {
        image.src = require(`../${assets[i].src}`);
      }
      else if (assets[i].uploadSrc) {
        image.src = assets[i].uploadSrc;
      }
      else {
        image.src = ipfsNodePath + hashes[i];
      }

      let attribute = parseInt(objs[i].attributes, 10);

      assets[i] = {
        ...assets[i],
        attributes: objs[i].attributes,
        isBackground: Math.floor((attribute / 100) % 10) === 1,
        shouldScale: Math.floor(attribute % 10) === 1,
        shouldRotate: Math.floor((attribute / 10) % 10) === 1,
        image,
      };
    }

    assets = helpers.moveBackgrounds(assets);

    preloadImages(assets)
      .done(async (loadedImages) => {
        for (let i = 0; i < assets.length; i++) {
          if (!loadedImages[i].image.failed) {
            if (assets[i].src) { // landing page assets are resized 10x
              assets[i].image.width = assets[i].image.width * 10;
              assets[i].image.height = assets[i].image.height * 10;
            }

            await drawLoadedImage(context, assets[i], canvasWidth, canvasHeight, frame, i, delay);

            if (delay > 0) {
              await drawBottomFrame(context, canvasHeight, canvasWidth, frame);
            }

            if (frame.shouldDrawFrame) {
              // DRAW FRAME
              drawFrame(context, canvasHeight, canvasWidth, frame);
            }
          }
          if (i === assets.length - 1) {
            if (delay === 0) {
              await drawBottomFrame(context, canvasHeight, canvasWidth, frame);
            }
            resolve({ message: 'Success' });
          }
        }
      });
  });

const imgLoaded = (img) => img.complete && img.naturalHeight !== 0;

const waitForBackgroundLoad = (images, cb) => {
  const interval = setInterval(() => {
    let backgrounds = images.filter(image => image.isBackground);
    for (let i = 0; i < backgrounds.length; i++) {
      if (!imgLoaded(backgrounds[i].image)) return;
    }
    cb();
    clearInterval(interval);
  }, 300);
};

export const drawImageRot = (context, img, x, y, width, height, deg, scale, options) => {
  const { isBackground, shouldScale, shouldRotate } = options;
  const coords = {
    x: width / 2 * (-1),
    y: height / 2 * (-1)
  };
  const multiplier = shouldScale ? scale / 1000 : 1;

  if (options && isBackground) {
    context.drawImage(img, 0, 0, width, height);
    return;
  }

  const angle = shouldRotate ? deg : 0;

  //Convert degrees to radian
  const rad = angle * Math.PI / 180;

  //Set the origin to the center of the image
  context.translate(x, y);

  //Rotate the canvas around the origin
  context.rotate(rad);

  //draw the image
  context.drawImage(img, coords.x, coords.y, width * multiplier, height * multiplier);

  //reset the canvas
  context.rotate(rad * (-1));

  //
  context.translate((x) * (-1), (y) * (-1));
};
