'use strict';

const express = require('express');

// Middleware
// const pagination = require('./pagination');

// Controllers
// const activityController = require('./activity/controller');

const apiRoutes = express.Router();
const v1Routes = express.Router();

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use('/v1', v1Routes);

// v1Routes.get('/activity-log', activityController.getActivity);

module.exports = apiRoutes;