import Vue from 'vue';
import VueRouter from 'vue-router';

// import Parent from 'pages/Parent/Parent.vue';
import About from 'pages/About/About.vue';
import Gallery from 'pages/Gallery/Gallery.vue';
import Landing from 'pages/Landing/Landing.vue';
import SingleGraphic from 'pages/SingleGraphic/SingleGraphic.vue';
import AssetPacks from 'pages/AssetPacks/AssetPacks.vue';
import Profile from 'pages/Profile/Profile.vue';
import CreateGraphic from 'pages/CreateGraphic/CreateGraphic.vue';
import UploadAssetPack from 'pages/UploadAssetPack/UploadAssetPack.vue';
import AssetPackPreview from 'pages/AssetPackPreview/AssetPackPreview.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Landing },
    // { path: '/legacy', component: Parent },
    { path: '/about', component: About },
    // { path: '/landing', component: Landing },
    { path: '/single-graphic/:id', component: SingleGraphic },
    { path: '/create-graphic', component: CreateGraphic },
    { path: '/gallery', component: Gallery }, // Gallery here
    { path: '/upload-asset-pack', component: UploadAssetPack },
    { path: '/asset-packs', component: AssetPacks },
    { path: '/asset-pack/:id', component: AssetPackPreview },
    { path: '/profile', component: Profile }
  ]
});

export default router;