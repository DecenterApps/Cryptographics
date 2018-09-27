<template>
    <div class="all-assets-page">
        <div class="container">
            <div class="asset-pack-header">
                <div class="left-section">
                    <h1 class="large-title">{{ assetPack.packName }}</h1>
                    <p class="small-title">
                        <span>Assets in pack - {{ assetPack.assets.length }}</span>
                        <span>{{ regularAssets }} are dynamic assets</span>
                        <span>{{ backgroundAssets }} are static backgrounds</span>
                    </p>
                    <p class="asset-pack-description">{{ assetPack.packDescription }}</p>
                </div>
                <div class="right-section">
                    <cg-button @click="composeWithAP" buttonStyle="secondary">Compose with this Asset Pack</cg-button>
                    <cg-button v-if="alreadyBought === false" @click="purchaseAssetPack">Buy</cg-button>
                </div>
            </div>
            <div class="asset-list">
                <div
                    class="asset"
                    v-for="(asset, index) in assetPack.assets"
                    :key="index">
                    <span
                        v-if="Math.floor((asset.attribute / 100) % 10) === 1"
                        class="asset-type">Static Background</span>
                    <span
                        v-else
                        class="asset-type">Asset</span>
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
        alreadyBought: false,
        backgroundAssets: 0,
        regularAssets: 0,
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
        this.$router.push('/create-cryptographic')
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
      this.assetPack.assets.forEach(asset => {
        Math.floor((asset.attribute / 100) % 10) === 1 ? this.backgroundAssets += 1 : null;
      })
      this.regularAssets = this.assetPack.assets.length - this.backgroundAssets;
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
        span {
          display: block;
          margin-bottom: 3px;
          &:first-of-type {
            font-weight: bold;
            margin-bottom: 8px;
          }
        }
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
        margin-bottom: 120px;

        .asset {
            position: relative;
            display: inline-block;
            text-align: center;
            background-color: #ECECEC;
            padding: 30px 10px;
            box-sizing: border-box;
            width: 19%;
            max-height: 19%;
            height: 213px;
            margin: 0 1.25% 1.25% 0;
            vertical-align: top;
            &:nth-child(5n) {
                margin-right: 0;
            }
            &:hover {
                .asset-type {
                    opacity: 1;
                }
            }
            .asset-type {
                position: absolute;
                top: 0;
                left: 0;
                background-color: #C7C7C7;
                color: #fff;
                padding: 5px 10px;
                font-size: 12px;
                min-height: 22px;
                min-width: 22px;
                pointer-events: none;
                transition: opacity .2s ease-in-out;
                opacity: .4;
                &.is-bg {
                    background-color: #F55800;
                }
            }
            img {
                position: relative;
                max-height: 100%;
                max-width: 100%;
            }
        }
    }
</style>