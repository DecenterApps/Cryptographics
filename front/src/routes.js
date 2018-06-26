import Parent from './components/Parent.vue';
import About from './components/About.vue';
import Home from './components/Home/Home.vue';

export default [
  { path: '/', component: Home },
  { path: '/legacy', component: Parent },
  { path: '/about', component: About },
  { path: '/create', component: About },
  { path: '/gallery', component: About },
  { path: '/asset_packs', component: About },
];