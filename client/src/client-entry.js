import { app } from './app';
import * as ipfsService from 'services/ipfsService';
import * as helpers from 'services/helpers';

window.onload = () => {
  helpers.checkProvider();
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