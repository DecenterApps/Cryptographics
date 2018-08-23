import Vue from 'vue';
import { VueMasonryPlugin } from 'vue-masonry';
import VueCarousel from 'vue-carousel';
import router from './router';
import store from './store/store';
import Vuebar from 'vuebar';
import AsyncComputed from 'vue-async-computed';

import App from './components/App.vue';

import Layout from 'shared/Layout/Layout.vue';
import SliderGallery from 'shared/SliderGallery/SliderGallery.vue';
import Button from 'shared/UI/Button.vue';
import ButtonLink from 'shared/UI/ButtonLink.vue';
import Input from 'shared/UI/Input.vue';
import Radio from 'shared/UI/Radio.vue';
import Checkbox from 'shared/UI/Checkbox.vue';
import AssetBox from 'shared/UI/AssetBox.vue';
import AssetCircleLink from 'shared/UI/AssetCircleLink.vue';
import UserLink from 'shared/UI/UserLink.vue';
import Price from 'shared/UI/Price.vue';
import Overlay from 'shared/UI/Overlay.vue';
import ButtonIcon from 'shared/UI/ButtonIcon.vue';
import Modal from 'shared/Modal/Modal.vue';
import LoadingModal from 'shared/LoadingModal/LoadingModal.vue';
import InputFile from 'shared/UI/InputFile.vue';
import Pagination from 'shared/Pagination/Pagination.vue';
import Separator from 'shared/UI/Separator.vue';
import Loader from 'shared/UI/Loader.vue';

Vue.component('layout', Layout);
Vue.component('sliderGallery', SliderGallery);
Vue.component('cgButton', Button);
Vue.component('buttonLink', ButtonLink);
Vue.component('cgInput', Input);
Vue.component('cgRadio', Radio);
Vue.component('cgCheckbox', Checkbox);
Vue.component('assetBox', AssetBox);
Vue.component('assetCircleLink', AssetCircleLink);
Vue.component('userLink', UserLink);
Vue.component('price', Price);
Vue.component('overlay', Overlay);
Vue.component('buttonIcon', ButtonIcon);
Vue.component('inputFile', InputFile);
Vue.component('pagination', Pagination);
Vue.component('modal', Modal);
Vue.component('loader', Loader);
Vue.component('loadingModal', LoadingModal);
Vue.component('separator', Separator);

Vue.use(VueMasonryPlugin);
Vue.use(VueCarousel);
Vue.use(Vuebar);
Vue.use(AsyncComputed);

const app = new Vue({
  ...App,
  router,
  store
});

export { app };