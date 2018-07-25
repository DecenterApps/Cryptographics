import Vue from 'vue';
import Vuex from 'vuex'; 
import VueRouter from 'vue-router';
import { VueMasonryPlugin } from 'vue-masonry';
import routes from './routes';
import Vuebar from 'vuebar';

// import VuexStore from './store/store';

import App from './components/App.vue';
import Layout from './components/Shared/Layout/Layout.vue';
import SliderGallery from './components/Shared/SliderGallery/SliderGallery.vue';
import Button from './components/Shared/UI/Button.vue';
import ButtonLink from './components/Shared/UI/ButtonLink.vue';
import Input from './components/Shared/UI/Input.vue';
import Radio from './components/Shared/UI/Radio.vue';
import Checkbox from './components/Shared/UI/Checkbox.vue';
import AssetCircle from './components/Shared/UI/AssetCircle.vue';
import UserLink from './components/Shared/UI/UserLink.vue';
import Overlay from './components/Shared/UI/Overlay.vue';
import ButtonIcon from './components/Shared/UI/ButtonIcon.vue';

Vue.component('layout', Layout);
Vue.component('sliderGallery', SliderGallery);
Vue.component('cgButton', Button);
Vue.component('buttonLink', ButtonLink);
Vue.component('cgInput', Input);
Vue.component('cgRadio', Radio);
Vue.component('cgCheckbox', Checkbox);
Vue.component('assetCircle', AssetCircle);
Vue.component('userLink', UserLink);
Vue.component('overlay', Overlay);
Vue.component('buttonIcon', ButtonIcon);

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueMasonryPlugin);
Vue.use(Vuebar);

const router = new VueRouter({
  mode: 'history',
  routes
});

// const store = new Vuex.Store(VuexStore);

const app = new Vue({
  ...App,
  router,
  // store
});

export { app };