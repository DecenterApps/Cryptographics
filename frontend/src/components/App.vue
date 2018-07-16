<template>
    <div>
        <Header></Header>
        <router-view></router-view>
    </div>
</template>

<script>
  import Header from './Header.vue';

  export default {
    name: 'App',
    components: {
      Header,
    }
  };
</script>

<style src="../templates/styles/reset.css"></style>
<style lang="scss" src="../templates/styles/common.scss"></style>
<style>
    *, *:after, *:before {
        box-sizing: border-box;
    }
    body, html {
        font-family: Roboto, sans-serif;
    }
    @font-face {
        font-family: 'YoungSerif-Regular';
        src: url('../assets/fonts/YoungSerif-Regular.eot');
        src: url('../assets/fonts/YoungSerif-Regular.woff2') format('woff2'),
        url('../assets/fonts/YoungSerif-Regular.woff') format('woff'),
        url('../assets/fonts/YoungSerif-Regular.ttf') format('truetype'),
        url('../assets/fonts/YoungSerif-Regular.svg#YoungSerif-Regular') format('svg'),
        url('../assets/fonts/YoungSerif-Regular.eot?#iefix') format('embedded-opentype');
        font-weight: normal;
        font-style: normal;
    }

    .large-title {
        font-family: 'YoungSerif-Regular', sans-serif;
        font-size: 32px;
    }
</style>