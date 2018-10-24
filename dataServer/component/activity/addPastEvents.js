const web3 = require('../web3Provider');
const clientConfig = require('../../../client/config/clientConfig');
const { updateAssetPackCreated } = require('./events/assetPackCreated/helper');
const { updateAssetPackBought } = require('./events/assetPackBought/helper');
const { updateImageBought } = require('./events/imageBought/helper');
const { updateSellingImage } = require('./events/sellingImage/helper');
const { updateImageCreated } = require('./events/imageCreated/helper');
const {
  getLatestEvents,
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
} = require('../ethereumService');

const addPastActivityEvents = async () => {
  const meta = [
    // { contract: assetManagerContract, event: 'AssetPackCreated', handler: updateAssetPackCreated },
    // { contract: assetManagerContract, event: 'AssetPackBought', handler: updateAssetPackBought },
    // { contract: marketPlaceContract, event: 'ImageBought', handler: updateImageBought },
    // { contract: marketPlaceContract, event: 'SellingImage', handler: updateSellingImage },
    { contract: digitalPrintImageContract, event: 'ImageCreated', handler: updateImageCreated },
  ];

  const fromBlock = await web3.eth.getBlockNumber() - 50000;
  // const fromBlock = clientConfig.deployBlockNumber;

  const promises = meta.map(({ contract, event, handler }) =>
    getLatestEvents(contract, event, fromBlock, handler));

  try {
    const events = await Promise.all(promises);
    console.log('OVER');
  } catch(err) {
    console.log('Get past events error', err);
  }
};

addPastActivityEvents();
