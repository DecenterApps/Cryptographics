const { getGalleryImage } = require('../../../ethereumService');
const logger = require('../../../../config/logger');
const web3 = require('../../../web3Provider');
const ImageBought = require('./model');

const getAdditionalImageBoughtData = ({ imageId, newOwner, price }) =>
  new Promise(async (resolve, reject) => {
    try {
      const amount = web3.utils.fromWei(price, 'ether');
      const graphicData = await getGalleryImage(imageId, false);

      resolve({ ...graphicData, amount });
    } catch(err) {
      logger.error(err);
      reject('getAdditionalImageBoughtData', err);
    }
  });

const updateImageBought = (event, txHash, blockNumber) =>
  new Promise(async (resolve, reject) => {
    try {
      const imageBoughtData = await getAdditionalImageBoughtData(event);

      const query = { txHash };
      const update = {
        id: imageBoughtData.id,
        title: imageBoughtData.title,
        ownerAddress: imageBoughtData.owner,
        ownerUsername: imageBoughtData.username,
        ownerAvatar: imageBoughtData.avatar,
        graphicSrc: imageBoughtData.src,
        amount: imageBoughtData.amount,
        txHash,
        blockNumber,
      };

      const entry = await ImageBought.updateOne(query, { $set: update }, { upsert: true, setDefaultsOnInsert: true });

      resolve(entry);

      resolve(imageBoughtData);
    } catch(err) {
      logger.error(err);
      reject('Error updating the image bought event', err);
    }
  });

module.exports = {
  updateImageBought,
};
