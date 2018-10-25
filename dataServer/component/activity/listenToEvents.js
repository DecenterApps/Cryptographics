const logger = require('../../config/logger');
const ACTIVITY_EVENTS_META = require('./activityEventsMeta');
const { listenToEvent } = require('../ethereumService');

const listenToActivityEvents = async () => {
  try {
    const promises = ACTIVITY_EVENTS_META.map(({ contract, event, handler }) => listenToEvent(contract, event, handler));
    await Promise.all(promises);

    logger.info('Activity events listeners initialized');
  } catch (err) {
    logger.error('Listen to activity events error: ', err);
  }
};

listenToActivityEvents();
