<template>
    <div>
        <slider-gallery></slider-gallery>
        <div class="container">
            <h1 class="large-title"> Asset Packs </h1>
            <my-assets :showAll="true"></my-assets>
        </div>



    </div>
</template>

<script>
  import SliderGallery from './SliderGallery/SliderGallery.vue';
  import MyAssets from './MyAssets.vue';
  import {getAccounts} from '../../scripts/helpers.js';

  export default {
    components: { MyAssets, SliderGallery },
    data: () => ({
      page: [],
      metamask_account: 0,
    }),

    async created() {
        this.page = 1;
        },
    async beforeCreate() {
        this.metamask_account = await getAccounts();
    },
    computed: {},
    methods: {},
    render() {

    },
  };
</script>

<style scoped>
    img {
        margin-right: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 150px;
        height: 150px;
    }
    .asset-packs-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    .large-title{
        margin-top: 29px;
        margin-bottom: 41px;
    }
</style>