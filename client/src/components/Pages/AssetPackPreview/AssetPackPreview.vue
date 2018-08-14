<template>
    <div class="all-assets-page">
        <slider-gallery />
        <div class="container">
            <div class="asset-pack-header">
                <h1 class="large-title">{{ assetPack.packName }}</h1>
                <div class="right-section">
                    <span class="large-title">Assets in pack - {{ assetPack.assets.length }}</span>
                    <cg-button>Buy</cg-button>
                </div>
            </div>
            <div class="asset-list">
                <div class="asset" v-for="asset in assetPack.assets">
                    <img :src="asset.src" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { getAssetPackData } from 'services/ethereumService.js';
  import AssetsPackPagination from '../Profile/template/AssetsPackPagination.vue';

  export default {
    name: 'AssetPackPreview',
    components: {
      AssetsPackPagination
    },
    data() {
      return {
        assetPack: {},
        showYourPacks: true,
      };
    },
    async created() {
      console.log(this.$route.params.id);
      this.assetPack = await getAssetPackData(this.$route.params.id);
    }
  };
</script>

<style scoped lang="scss">
    .large-title {
        margin-top: 29px;
        margin-bottom: 41px;
    }

    .right-section {
        display: flex;
        justify-content: center;
    }

    span.large-title {
        margin: 0 20px 0 0;
        font-size: 22px;
    }

    .asset-pack-header {
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

    .asset-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 120px;

        .asset {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 206px;
            width: 206px;
            margin: 9px;
            background-color: #ECECEC;
            padding: 10px;
            box-sizing: border-box;
            img {
                max-height: 100%;
                max-width: 100%;
            }
        }
    }
</style>