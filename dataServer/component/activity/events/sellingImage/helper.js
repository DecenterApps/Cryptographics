const { getDateDiff } = require('../../../utils');
const { getGalleryImage, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const web3 = require('../../../web3Provider');

const getAdditionalSellingImage = ({ imageId, price }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const amount = web3.utils.fromWei(price, 'ether');
      const graphicData = await getGalleryImage(imageId, false);

      const block = await getBlock(blockNumber);
      const timeDiff = getDateDiff(block.timestamp);

      resolve({ ...graphicData, timestamp: timeDiff, amount });
    } catch(err) {
      logger.error(err);
      reject(err);
    }
  });

const updateSellingImage = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const sellingImageData = await getAdditionalSellingImage(event, blockNumber);
      sellingImageData.txHash = txHash;
      sellingImageData.blockNumber = blockNumber;

      resolve(sellingImageData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the selling image event', err);
    }
  });

module.exports = {
  updateSellingImage,
};
