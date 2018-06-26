import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueMasonryPlugin } from 'vue-masonry';
import routes from './routes';

import App from './components/App.vue';

const router = new VueRouter({
  mode: 'history',
  routes,
});

Vue.use(VueRouter);
Vue.use(VueMasonryPlugin);

const app = new Vue({
  ...App,
  router,
});

export { app };