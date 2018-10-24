const { getDateDiff } = require('../../../utils');
const logger = require('../../../../config/logger');
const {
  getGalleryImage, getBlock, getImageMetadata, getAssetsOrigins, getSelectedAssetPacksWithAssetData,
} = require('../../../ethereumService');

const getAdditionalImageCreatedData = ({ imageId }, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const graphicData = await getGalleryImage(imageId, false);
      const metadata = await getImageMetadata(imageId);

      let assets = await getAssetsOrigins(metadata.usedAssets);
      assets = await getSelectedAssetPacksWithAssetData(assets);

      const block = await getBlock(blockNumber);
      const timeDiff = getDateDiff(block.timestamp);

      resolve({ ...graphicData, assets, timestamp: timeDiff });
    } catch(err) {
      logger.error(err);
      reject(err);
    }
  });

const updateImageCreated = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const sellingImageData = await getAdditionalImageCreatedData(event, blockNumber);
      sellingImageData.txHash = txHash;
      sellingImageData.blockNumber = blockNumber;

      resolve(sellingImageData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the image created event', err);
    }
  });

module.exports = {
  updateImageCreated,
};