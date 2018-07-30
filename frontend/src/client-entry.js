import { app } from './app';
import * as ipfsService from 'services/ipfsService';

window.onload = () => {
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