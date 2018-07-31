<template>
    <main>
        <cg-header/>
        <router-view/>
        <cg-footer/>
        <modal v-if="showModal" :content="content"/>
    </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SET_USER_CONFIG, SET_USERNAME, UPDATE_USER_CONFIG } from 'store/user-config/types';
import { TOGGLE_MODAL } from 'store/modal/types';

import CgHeader from 'shared/CgHeader/CgHeader.vue';
import CgFooter from 'shared/CgFooter/CgFooter.vue';

export default {
    name: 'App',
    components: {
        CgHeader,
        CgFooter
    },
    beforeMount() {
        this[SET_USER_CONFIG]();
    },
    mounted() {
        this[UPDATE_USER_CONFIG]();
    },
    methods: {
        ...mapActions({
            SET_USER_CONFIG,
            UPDATE_USER_CONFIG,
            openModal: TOGGLE_MODAL
        })
    },
    computed: {
        ...mapState({
            showModal: ({ modal }) => modal.showModal,
            content: ({ modal }) => modal.content
        })
    }
};
</script>

<style src="../templates/styles/reset.css"></style>
<style lang="scss" src="../templates/styles/common.scss"></style>
<style lang="scss">
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
        line-height: 1;
    }
    main {
        position: relative;
    }
</style>