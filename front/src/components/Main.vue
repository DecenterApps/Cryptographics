<template>
    <div>
        <my-header></my-header>
        <h2> Cryptographics </h2>
        <parent></parent>
        <my-footer></my-footer>
    </div>
</template>

<script>
    import Header from './Header.vue';
    import Footer from './Footer.vue';
    import Parent from './Parent.vue';
    export default {

        components: {
            'my-header' : Header,
            'my-footer' : Footer,
            'parent' : Parent,
        },
    }
</script>

<style scoped>
    html, body {
        margin: 0;
        padding: 0;
    }
</style>