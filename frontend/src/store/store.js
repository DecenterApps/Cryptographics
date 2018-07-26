import Vue from 'vue';
import Vuex from 'vuex';

import router from '../router';

Vue.use(Vuex);

import userConfig from './modules/user-config/index.js';

const store =  new Vuex.Store({
    modules: {
        userConfig
    }
});

export default store;