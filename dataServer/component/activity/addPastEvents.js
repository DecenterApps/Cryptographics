const logger = require('../../config/logger');
const clientConfig = require('../../../client/config/clientConfig');
const ACTIVITY_EVENTS_META = require('./activityEventsMeta');
const { getLatestEvents } = require('../ethereumService');

const addPastActivityEvents = async () => {
  // ADD that the from block is the oldest event from a set of latest events (1 for each event type)
  const fromBlock = clientConfig.deployBlockNumber;

  try {
    const promises = ACTIVITY_EVENTS_META.map(({ contract, event, handler }) => getLatestEvents(contract, event, fromBlock, handler));

    await Promise.all(promises);

    logger.info('Adding past events is finished');
    process.exit();
  } catch(err) {
    logger.error(err);
    console.log('Get past events error', err);
    process.exit(1);
  }
};

addPastActivityEvents();
