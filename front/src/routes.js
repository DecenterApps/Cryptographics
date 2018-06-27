import Parent from './components/Parent.vue';
import About from './components/About.vue';
import Home from './components/Home/Home.vue';
import AllAssets from './components/AllAssets.vue'
import Profile from './components/MyProfile.vue';
import CreateArt from './components/CreateArt/CreateArt.vue';

export default [
  { path: '/', component: Home },
  { path: '/legacy', component: Parent },
  { path: '/about', component: About },
  { path: '/create', component: CreateArt },
  { path: '/gallery', component: About },
  { path: '/asset_packs', component: AllAssets },
  { path: '/profile', component: Profile },
];