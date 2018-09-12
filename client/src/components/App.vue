<template>
    <main>
        <cg-header />
        <keep-alive>
            <!-- Keep slider alive between routes -->
            <slider-gallery v-if="[
                                '/gallery',
                                '/asset-packs',
                                '/about',
                                '/profile',
                                '/asset-pack/:id',
                                '/user/:userId',
                            ].indexOf($route.matched[0].path) >= 0" />
        </keep-alive>
        <router-view />
        <cg-footer />
        <modal v-if="showModal" :content="content" />
        <loading-modal v-if="showLoadingModal" />
        <error-bar v-if="network && deployedNetwork !== network"
                   :error="`Wrong network, please switch to ${testnets[deployedNetwork]} testnet.`"
        />
    </main>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import { SET_USER_CONFIG, SET_USERNAME, UPDATE_USER_CONFIG, NETWORK } from 'store/user-config/types';
  import { TOGGLE_MODAL } from 'store/modal/types';

  import CgHeader from 'shared/CgHeader/CgHeader.vue';
  import CgFooter from 'shared/CgFooter/CgFooter.vue';
  import ErrorBar from './Shared/ErrorBar/ErrorBar';
  import clientConfig from 'config/clientConfig.json';
  import { testnets } from 'config/constants';

  export default {
    name: 'App',
    components: {
      ErrorBar,
      CgHeader,
      CgFooter
    },
    data: () => ({
      deployedNetwork: clientConfig.network,
      testnets,
    }),
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
      ...mapGetters({
        network: NETWORK,
      }),
      ...mapState({
        showLoadingModal: ({ modal }) => modal.showLoadingModal,
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

    .subtitle {
        font-size: 16px;
        line-height: 20px;
        letter-spacing: .5px;
        margin-bottom: 16px;
        color: black;
    }

    main {
        position: relative;
    }
</style>