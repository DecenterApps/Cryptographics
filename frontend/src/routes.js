import Parent from './components/Pages/Parent/Parent.vue';
import About from './components/Pages/About/About.vue';
import Home from './components/Pages/Home/Home.vue';
import Landing from './components/Pages/Landing/Landing.vue';
import SingleGraphic from './components/Pages/SingleGraphic/SingleGraphic.vue';
import AssetPacks from './components/Pages/AssetPacks/AssetPacks.vue';
import Profile from './components/Pages/Profile/Profile.vue';
import CreateGraphic from './components/Pages/CreateGraphic/CreateGraphic.vue';
import UploadAssetPack from './components/Pages/UploadAssetPack/UploadAssetPack.vue';

export default [
  { path: '/', component: Home },
  { path: '/legacy', component: Parent },
  { path: '/about', component: About },
  { path: '/landing', component: Landing },
  { path: '/single-graphic', component: SingleGraphic },
  { path: '/create-graphic', component: CreateGraphic },
  { path: '/gallery', component: About }, // Gallery here
  { path: '/upload-asset-pack', component: UploadAssetPack},
  { path: '/asset-packs', component: AssetPacks },
  { path: '/profile', component: Profile },
];