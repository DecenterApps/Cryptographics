<template>
    <main>
        <cg-header/>
        <router-view/>
        <cg-footer/>
    </main>
</template>

<script>
import CgHeader from './Shared/CgHeader/CgHeader.vue';
import CgFooter from './Shared/CgFooter/CgFooter.vue';

export default {
    name: 'App',
    components: {
        CgHeader,
        CgFooter
    }
};
</script>

<style src="../templates/styles/reset.css"></style>
<style lang="scss" src="../templates/styles/common.scss"></style>
<style>
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