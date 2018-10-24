const { getDateDiff } = require('../../../utils');
const { getAssetPackData, getUserInfo, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');

const getAdditionalAssetPackCreatedData = ({ id, owner }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackData = await getAssetPackData(id);
      const ownerData = await getUserInfo(owner);

      const block = await getBlock(blockNumber);
      const timeDiff = getDateDiff(block.timestamp);

      resolve({ ...assetPackData, ...ownerData, timestamp: timeDiff });
    } catch(err) {
      logger.error(err);
      reject(err);
    }
  });

const updateAssetPackCreated = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {

    try {
      const assetPackCreatedData = await getAdditionalAssetPackCreatedData(event, blockNumber);
      assetPackCreatedData.txHash = txHash;
      assetPackCreatedData.blockNumber = blockNumber;

      resolve(assetPackCreatedData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the asset pack created event', err);
    }
  });

module.exports = {
  updateAssetPackCreated,
};
