const { getAssetPackData, getUserInfo, getBlock } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const AssetPackBought = require('./model');

const getAdditionalAssetPackBoughtData = ({ id, buyer }) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackData = await getAssetPackData(id);
      const ownerData = await getUserInfo(buyer);

      resolve({ ...assetPackData, ...ownerData });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalAssetPackBoughtData', err);
    }
  });

const updateAssetPackBought = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackBoughtData = await getAdditionalAssetPackBoughtData(event);
      const block = await getBlock(blockNumber);

      const query = { txHash };
      const update = {
        id: assetPackBoughtData.id,
        title: assetPackBoughtData.title,
        packCoverSrc: assetPackBoughtData.packCoverSrc,
        ownerAddress: assetPackBoughtData.creator,
        ownerUsername: assetPackBoughtData.username,
        ownerAvatar: assetPackBoughtData.avatar,
        timestamp: block.timestamp,
        txHash,
        blockNumber,
      };

      const entry = await AssetPackBought.updateOne(query, { $set: update }, { upsert: true, setDefaultsOnInsert: true });

      resolve(entry);
    } catch(err) {
      logger.error(err);
      reject('Error updating the asset pack bought event', err);
    }
  });

module.exports = {
  updateAssetPackBought,
};
