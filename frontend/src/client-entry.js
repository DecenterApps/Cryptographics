import { app } from './app';
import Web3 from 'web3';
import * as ipfsService from '../scripts/ipfsService';

window.onload = () => {
  console.log(Ipfs);
  window.web3 = new Web3(window.web3.currentProvider);
  window.node = new Ipfs({
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