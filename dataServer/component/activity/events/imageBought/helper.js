const { getDateDiff } = require('../../../utils');
const { getGalleryImage, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const web3 = require('../../../web3Provider');

const getAdditionalImageBoughtData = ({ imageId, newOwner, price }, blockNumber) =>
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

const updateImageBought = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const imageBoughtData = await getAdditionalImageBoughtData(event, blockNumber);
      imageBoughtData.txHash = txHash;
      imageBoughtData.blockNumber = blockNumber;

      resolve(imageBoughtData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the image bought event', err);
    }
  });

module.exports = {
  updateImageBought,
};
