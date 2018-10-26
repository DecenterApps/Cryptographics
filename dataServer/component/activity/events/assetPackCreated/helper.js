const { getAssetPackData, getUserInfo } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const AssetPackCreated = require('./model');

const getAdditionalAssetPackCreatedData = ({ id, owner }) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackData = await getAssetPackData(id);
      const ownerData = await getUserInfo(owner);

      resolve({ ...assetPackData, ...ownerData });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalAssetPackCreatedData', err);
    }
  });

const updateAssetPackCreated = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const assetPackCreatedData = await getAdditionalAssetPackCreatedData(event);

      const query = { txHash };
      const update = {
        id: assetPackCreatedData.id,
        title: assetPackCreatedData.title,
        packCoverSrc: assetPackCreatedData.packCoverSrc,
        ownerAddress: assetPackCreatedData.creator,
        ownerUsername: assetPackCreatedData.username,
        ownerAvatar: assetPackCreatedData.avatar,
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
