const { getAssetPackData, getUserInfo, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const AssetPackCreated = require('./model');

const getAdditionalAssetPackCreatedData = ({ id, owner }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackData = await getAssetPackData(id);
      const ownerData = await getUserInfo(owner);

      const block = await getBlock(blockNumber);

      resolve({ ...assetPackData, ...ownerData, timestamp: block.timestamp });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalAssetPackCreatedData', err);
    }
  });

const updateAssetPackCreated = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackCreatedData = await getAdditionalAssetPackCreatedData(event, blockNumber);

      const query = { txHash };
      const update = {
        id: assetPackCreatedData.id,
        packCoverSrc: assetPackCreatedData.packCoverSrc,
        creatorAddress: assetPackCreatedData.creator,
        creatorUsername: assetPackCreatedData.username,
        creatorAvatar: assetPackCreatedData.avatar,
        timestamp: assetPackCreatedData.timestamp,
        txHash,
        blockNumber,
      };

      const entry = await AssetPackCreated.updateOne(query, { $set: update }, { upsert: true, setDefaultsOnInsert: true });

      resolve(entry);
    } catch(err) {
      logger.error(err);
      reject('Error updating the asset pack created event', err);
    }
  });

module.exports = {
  updateAssetPackCreated,
};
