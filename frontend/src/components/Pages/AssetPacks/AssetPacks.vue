<template>
    <div class="all-assets-page">
        <slider-gallery/>
        <div class="container">
            <div class="all-assets-header">
                <h1 class="large-title"> Asset Packs </h1>
                <router-link to="/create-asset-pack">
                    <button class="default-button submit">Create Asset Pack</button>
                </router-link>
            </div>
            <asset-packs-pagination :show-all="true" />
        </div>
        <cg-footer/>
    </div>
</template>

<script>
  import AssetPacksPagination from '../../Shared/AssetPacksPagination/AssetPacksPagination.vue';

  export default {
    name: 'AssetPacks',
    components: {
        AssetPacksPagination, 
    },
    data: () => ({}),
    async created() {
    },
    computed: {},
    methods: {},
    render() {

    },
  };
</script>

<style scoped lang="scss">
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

    .all-assets-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
            text-decoration: none;
        }

        button {
            width: 140px;
        }

    }

    .large-title {
        margin-top: 29px;
        margin-bottom: 41px;
    }
</style>