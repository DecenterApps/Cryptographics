import Vue from 'vue';
import VueRouter from 'vue-router';

import About from 'pages/About/About.vue';
import GalleryPage from 'pages/GalleryPage/GalleryPage.vue';
import Landing from 'pages/Landing/Landing.vue';
import SingleGraphic from 'pages/SingleGraphic/SingleGraphic.vue';
import AssetPacks from 'pages/AssetPacks/AssetPacks.vue';
import Profile from 'pages/Profile/Profile.vue';
import CreateGraphic from 'pages/CreateGraphic/CreateGraphic.vue';
import CreateAssetPack from 'pages/CreateAssetPack/CreateAssetPack.vue';
import AssetPackPreview from 'pages/AssetPackPreview/AssetPackPreview.vue';
import FAQ from 'pages/FAQ/FAQ.vue';
import UIShowcase from 'shared/UI/UIShowcase.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Landing },
    { path: '/about', component: About },
    { path: '/cryptographic/:id', component: SingleGraphic },
    { path: '/create-cryptographic', component: CreateGraphic, name: 'create-cryptographic' },
    { path: '/gallery', component: GalleryPage }, // GalleryPage here
    { path: '/create-asset-pack', component: CreateAssetPack, name: 'create-asset-pack' },
    { path: '/asset-packs', component: AssetPacks },
    { path: '/asset-pack/:id', component: AssetPackPreview },
    { path: '/profile', component: Profile, props: { userProfile: true } },
    { path: '/user/:userId', component: Profile, props: { userProfile: false } },
    { path: '/ui-test', component: UIShowcase },
    { path: '/faq', component: FAQ },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

export default router;