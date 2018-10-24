const web3 = require('../web3Provider');
const clientConfig = require('../../../client/config/clientConfig');
const {
  getLatestEvents,
  assetManagerContract,
  marketPlaceContract,
  digitalPrintImageContract,
} = require('../ethereumService');

const addPastActivityEvents = async () => {
  const meta = [
    { contract: assetManagerContract, event: 'AssetPackCreated', handler: () => {} },
    // { contract: assetManagerContract, event: 'AssetPackBought' },
    // { contract: marketPlaceContract, event: 'ImageBought' },
    // { contract: marketPlaceContract, event: 'SellingImage' },
    // { contract: digitalPrintImageContract, event: 'ImageCreated' },
  ];

  let num = 0;

  const promises = meta.map(({ contract, event, handler }) =>
    getLatestEvents(contract, event, clientConfig.deployBlockNumber, handler));

  try {
    const events = await Promise.all(promises);
    console.log('OVER');
  } catch(err) {
    console.log('Get past events error', err);
  }
};

addPastActivityEvents();
