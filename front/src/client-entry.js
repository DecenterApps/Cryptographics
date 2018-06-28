import { app } from './app';
import Web3 from 'web3';

window.onload = () => {
    window.web3 = new Web3(window.web3.currentProvider);
    app.$mount('#app');
};