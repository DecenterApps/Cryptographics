<template>
    <div>
        <my-header></my-header>
        <h2> Cryptographics </h2>
        <about v-if="currentRoute=='/about'"></about>
        <parent v-if="currentRoute=='/galery'"></parent>
        <my-profile v-if="currentRoute=='/profile'"></my-profile>
        <my-footer></my-footer>
    </div>
</template>

<script>
    import Header from './Header.vue';
    import Footer from './Footer.vue';
    import Parent from './Parent.vue';
    import About from './About.vue';
    import MyProfile from './MyProfile.vue';

    const routes = {
        '/' : 'Home',
        '/about' : About,
        '/profile' : MyProfile,
        '/create' : 'CreateImage',
        '/gallery' : 'Gallery',
        '/assetPacks' : 'AssetPacks',
    };

    export default {
        data : {
            currentRoute: window.location.pathname,
        },

        components: {
            'my-header' : Header,
            'my-footer' : Footer,
            'parent' : Parent,
            'about' : About,
            'my-profile' : MyProfile,
        },

        async beforeCreate() {
            this.currentRoute = window.location.pathname;
            console.log("ROUTE : " + this.currentRoute);
        }
    }
</script>

<style scoped>
    html, body {
        margin: 0;
        padding: 0;
    }

    h2 {
        font-size: 35px;
        position: center;
        margin-left: 500px;
    }
</style>