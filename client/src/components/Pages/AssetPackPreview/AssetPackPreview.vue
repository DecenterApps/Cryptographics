<template>
    <div class="all-assets-page">
        <div class="container">
            <div class="asset-pack-header">
                <div class="left-section">
                    <h1 class="large-title">{{ assetPack.packName }}</h1>
                    <p class="small-title">Assets in pack - {{ assetPack.assets.length }}</p>
                    <p class="asset-pack-description">{{ assetPack.packDescription }}</p>
                </div>
                <div class="right-section">
                    <cg-button @click="composeWithAP" buttonStyle="transparent">Compose with this Asset Pack</cg-button>
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
  import { SELECT_SINGLE_ASSET_PACK } from 'store/canvas/types';
  import { mapGetters, mapActions } from 'vuex';
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
      ...mapActions({
        selectSingleAssetPack: SELECT_SINGLE_ASSET_PACK,
      }),
      composeWithAP () {
        this.selectSingleAssetPack(this.assetPack);
        this.$router.push('/create-graphic')
      },
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
        max-width: 432px;
    }

    .asset-pack-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
            text-decoration: none;
        }

        button {
            margin-left: 20px;
        }

    }

    .asset-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 120px;
        justify-content: space-between;

        .asset {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 206px;
            width: 206px;
            margin-bottom: 22px;
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