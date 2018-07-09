import { app } from './app';
import Web3 from 'web3';
import IPFS from 'ipfs';
import * as ipfsService from '../scripts/ipfsService';

window.onload = () => {
  window.web3 = new Web3(window.web3.currentProvider);
  window.node = new IPFS({
    repo: 'cryptographics',
    config: {
      Bootstrap: ipfsService.bootstrapNodes,
      Addresses: {
        Swarm: [],
      },
    }
  });
  app.$mount('#app');
};