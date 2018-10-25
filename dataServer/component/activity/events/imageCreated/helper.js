const logger = require('../../../../config/logger');
const {
  getGalleryImage, getImageMetadata, getAssetsOrigins, getSelectedAssetPacksWithAssetData,
} = require('../../../ethereumService');
const ImageCreated = require('./model');

const getAdditionalImageCreatedData = ({ imageId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const graphicData = await getGalleryImage(imageId, false);
      const metadata = await getImageMetadata(imageId);

      let assets = await getAssetsOrigins(metadata.usedAssets);
      assets = await getSelectedAssetPacksWithAssetData(assets);

      resolve({ ...graphicData, assets });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalImageCreatedData', err);
    }
  });

const updateImageCreated = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const imageCreatedData = await getAdditionalImageCreatedData(event);

      const query = { txHash };
      const update = {
        id: imageCreatedData.id,
        title: imageCreatedData.title,
        ownerAddress: imageCreatedData.owner,
        ownerUsername: imageCreatedData.username,
        ownerAvatar: imageCreatedData.avatar,
        graphicSrc: imageCreatedData.src,
        assetPacks: imageCreatedData.assets.map(({ id, packCoverSrc }) => ({ id, packCoverSrc })),
        txHash,
        blockNumber,
      };

      const entry = await ImageCreated.updateOne(query, { $set: update }, { upsert: true, setDefaultsOnInsert: true });

      resolve(entry);
    } catch(err) {
      logger.error(err);
      reject('Error updating the image created event', err);
    }
  });

module.exports = {
  updateImageCreated,
};