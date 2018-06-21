<template>
    <div>
        <my-header></my-header>
        <h2> Cryptographics </h2>
        <about v-if="currentRoute=='/about'"></about>
        <parent v-if="currentRoute=='/galery'"></parent>
        <my-footer></my-footer>
    </div>
</template>

<script>
    import Header from './Header.vue';
    import Footer from './Footer.vue';
    import Parent from './Parent.vue';
    import About from './About.vue';


    const routes = {
        '/' : 'Home',
        '/about' : About,
        '/create' : 'CreateImage',
        '/gallery' : 'Gallery',
        '/assetPacks' : 'AssetPacks',
    }
    export default {
        data : {
            currentRoute: window.location.pathname,
        },

        components: {
            'my-header' : Header,
            'my-footer' : Footer,
            'parent' : Parent,
            'about' : About,
        },

        beforeCreate() {
            this.currentRoute = window.location.pathname;
            console.log("ROUTE" + this.currentRoute);
        }
    }
</script>

<style scoped>
    html, body {
        margin: 0;
        padding: 0;
    }
</style>