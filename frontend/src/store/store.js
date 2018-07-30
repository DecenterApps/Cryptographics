import Vue from 'vue';
import Vuex from 'vuex';

import router from '../router';

Vue.use(Vuex);

import userConfig from './modules/user-config/index.js';
import modal from './modules/modal/index.js';

const store =  new Vuex.Store({
    modules: {
        userConfig,
        modal
    }
});

export default store;