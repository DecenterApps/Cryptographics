import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueMasonryPlugin } from 'vue-masonry';
import routes from './routes';

import App from './components/App.vue';
import Button from './components/shared/UI/Button.vue';
import ButtonLink from './components/shared/UI/ButtonLink.vue';
import Input from './components/shared/UI/Input.vue';
import Radio from './components/shared/UI/Radio.vue';
import Checkbox from './components/shared/UI/Checkbox.vue';
import AssetCircle from './components/shared/UI/AssetCircle.vue';
import UserLink from './components/shared/UI/UserLink.vue';
import Overlay from './components/shared/UI/Overlay.vue';
import ButtonIcon from './components/shared/UI/ButtonIcon.vue';


Vue.component('cgButton', Button);
Vue.component('buttonLink', ButtonLink);
Vue.component('cgInput', Input);
Vue.component('cgRadio', Radio);
Vue.component('cgCheckbox', Checkbox);
Vue.component('assetCircle', AssetCircle);
Vue.component('userLink', UserLink);
Vue.component('overlay', Overlay);
Vue.component('buttonIcon', ButtonIcon);

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