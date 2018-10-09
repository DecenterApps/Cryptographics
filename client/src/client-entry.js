import { app } from './app';
import * as helpers from 'services/helpers';

window.onload = () => {
  helpers.checkProvider();
  app.$mount('#app');
};