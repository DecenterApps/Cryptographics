<template>
    <div class="all-assets-page">
        <slider-gallery />
        <div class="container">
            <div class="asset-pack-header">
                <div class="left-section">
                    <h1 class="large-title">{{ assetPack.packName }}</h1>
                    <p class="small-title">Assets in pack - {{ assetPack.assets.length }}</p>
                    <p class="asset-pack-description">{{ assetPack.packDescription }}</p>
                </div>
                <div class="right-section">
                    <cg-button v-if="alreadyBought === false" @click="purchaseAssetPack">Buy</cg-button>
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
  import { buyAssetPack, getAssetPackData, checkAssetPermission } from 'services/ethereumService';
  import { USERNAME, METAMASK_ADDRESS, AVATAR } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import AssetsPackPagination from '../Profile/template/AssetPacksPagination.vue';

  export default {
    name: 'AssetPackPreview',
    components: {
      AssetsPackPagination
    },
    data() {
      return {
        assetPack: {
          packName: '',
          assets: []
        },
        alreadyBought: false
      };
    },
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
      })
    },
    methods: {
      async purchaseAssetPack() {
        const result = await buyAssetPack(this.userAddress, this.$route.params.id);
        // HANDLE result from result.error
        console.log(result);
      }
    },
    async created() {
      this.assetPack = await getAssetPackData(this.$route.params.id);
      this.alreadyBought = await checkAssetPermission(this.userAddress, this.$route.params.id);
    }
  };
</script>

<style scoped lang="scss">
    .large-title {
        margin-top: 29px;
        margin-bottom: 0;
    }

    .right-section {
        display: flex;
        justify-content: center;
    }

    .small-title {
        margin: 16px 16px 29px 0;
        font-size: 12px;
        font-family: Roboto, sans-serif;
    }

    .asset-pack-description {
        font-weight: 300;
        line-height: 19px;
        font-size: 12px;
        color: #717171;
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
            margin-right: 18px;
            margin-bottom: 18px;
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