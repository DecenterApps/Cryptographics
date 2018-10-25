const { getGalleryImage } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const web3 = require('../../../web3Provider');
const SellingImage = require('./model');

const getAdditionalSellingImageData = ({ imageId, price }) =>
  new Promise(async (resolve, reject) => {
    try {
      const amount = web3.utils.fromWei(price, 'ether');
      const graphicData = await getGalleryImage(imageId, false);

      resolve({ ...graphicData, amount });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalSellingImageData', err);
    }
  });

const updateSellingImage = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const sellingImageData = await getAdditionalSellingImageData(event);

      const query = { txHash };
      const update = {
        id: sellingImageData.id,
        title: sellingImageData.title,
        ownerAddress: sellingImageData.owner,
        ownerUsername: sellingImageData.username,
        ownerAvatar: sellingImageData.avatar,
        graphicSrc: sellingImageData.src,
        amount: sellingImageData.amount,
        txHash,
        blockNumber,
      };

      const entry = await SellingImage.updateOne(query, { $set: update }, { upsert: true, setDefaultsOnInsert: true });

      resolve(entry);
    } catch(err) {
      logger.error(err);
      reject('Error updating the selling image event', err);
    }
  });

module.exports = {
  updateSellingImage,
};
