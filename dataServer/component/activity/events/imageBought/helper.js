const { getDateDiff } = require('../../../utils');
const { getGalleryImage, getUserInfo, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');

// event ImageBought(uint indexed imageId, address indexed newOwner, uint price);

const getAdditionalImageBoughtData = ({ imageId, newOwner, price }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const ammount = web3.utils.fromWei(price, 'ether');

      const graphicData = await getGalleryImage(imageId);
      const ownerData = await getUserInfo(newOwner);

      const block = await getBlock(blockNumber);
      const timeDiff = getDateDiff(block.timestamp);

      resolve({ ...graphicData, ...ownerData, timestamp: timeDiff, ammount });
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
      reject('Error updating the asset pack created event', err);
    }
  });

module.exports = {
  updateImageBought,
};
