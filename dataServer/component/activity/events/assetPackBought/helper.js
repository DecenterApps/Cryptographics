const { getDateDiff } = require('../../../utils');
const { getAssetPackData, getUserInfo, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');

const getAdditionalAssetPackBoughtData = ({ id, buyer }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackData = await getAssetPackData(id);
      const ownerData = await getUserInfo(buyer);

      const block = await getBlock(blockNumber);
      const timeDiff = getDateDiff(block.timestamp);

      resolve({ ...assetPackData, ...ownerData, timestamp: timeDiff });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalAssetPackBoughtData', err);
    }
  });

const updateAssetPackBought = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackBoughtData = await getAdditionalAssetPackBoughtData(event, blockNumber);
      assetPackBoughtData.txHash = txHash;
      assetPackBoughtData.blockNumber = blockNumber;

      resolve(assetPackBoughtData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the asset pack bought event', err);
    }
  });

module.exports = {
  updateAssetPackBought,
};
