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

<style>
    body, html {
        margin: 0;
        padding: 0;
    }
</style>