const { updateAssetPackCreated } = require('./events/assetPackCreated/helper');
const { updateAssetPackBought } = require('./events/assetPackBought/helper');
const { updateImageBought } = require('./events/imageBought/helper');
const { updateSellingImage } = require('./events/sellingImage/helper');
const { updateImageCreated } = require('./events/imageCreated/helper');
const {
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
} = require('../ethereumService');

const ACTIVITY_EVENTS_META = [
  { contract: assetManagerContract, event: 'AssetPackCreated', handler: updateAssetPackCreated },
  { contract: assetManagerContract, event: 'AssetPackBought', handler: updateAssetPackBought },
  { contract: marketPlaceContract, event: 'ImageBought', handler: updateImageBought },
  { contract: marketPlaceContract, event: 'SellingImage', handler: updateSellingImage },
  { contract: digitalPrintImageContract, event: 'ImageCreated', handler: updateImageCreated },
];

module.exports = ACTIVITY_EVENTS_META;