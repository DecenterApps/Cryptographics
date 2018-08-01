import Vue from 'vue';
import Vuex from 'vuex';

import router from '../router';

Vue.use(Vuex);

import userConfig from './modules/user-config/index.js';
import modal from './modules/modal/index.js';
import canvas from './modules/canvas/index.js';

const store = new Vuex.Store({
  modules: {
    userConfig,
    modal,
    canvas
  }
});

export default store;