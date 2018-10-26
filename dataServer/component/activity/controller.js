const logger = require('../../config/logger');
const httpStatus = require('http-status-codes');
const AssetPackBought = require('./events/assetPackBought/model');
const AssetPackCreated = require('./events/assetPackCreated/model');
const ImageBought = require('./events/imageBought/model');
const ImageCreated = require('./events/imageCreated/model');
const SellingImage = require('./events/sellingImage/model');
const ACTIVITY_EVENTS_META = require('./activityEventsMeta');
const web3 = require('../web3Provider');

const models = { AssetPackBought, AssetPackCreated, ImageBought, ImageCreated, SellingImage };

async function getBlock (req, res) {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    return res.json({ blockNumber })
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err })
  }
}

async function getActivity (req, res) {
  const blockNumberFrom = req.query.blockNumberFrom;
  const blockNumberTo = req.query.blockNumberTo;

  try {
    const promises = ACTIVITY_EVENTS_META.map(({ event }) =>
      models[event].find({'blockNumber': {
          $gte: blockNumberFrom,
          $lte: blockNumberTo,
        }})
    );

    let data = await Promise.all(promises);

    data = data.map((eventArray, index) =>
      eventArray.map(event => ({ ...event.toObject(), type: ACTIVITY_EVENTS_META[index].event }))
    );
    data = data.reduce((acc, val) => acc.concat(val), []);
    data = data.sort((a, b) => b.blockNumber - a.blockNumber);
    data = data.slice(0, 10);

    return res.json(data)
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err })
  }
}

module.exports = {
  getActivity,
  getBlock,
};
