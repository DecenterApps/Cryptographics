<template>
    <div class="all-assets-page">
        <div class="container">
            <div class="all-assets-header">
                <h1 class="large-title">Asset Packs</h1>
                <button-link to="/create-asset-pack">Create Asset Pack</button-link>
            </div>
            <p class="asset-pack-description">
                Asset packs are collections of graphical elements created and uploaded by the same Artist. Each
                asset pack has its price, but you only need to pay for each asset pack once.
            </p>
            <separator />
            <div class="assets">
                <div class="button-group">
                    <cg-button
                            :button-style="showPacks === 'all' ? 'tab-active' : 'tab-inactive'"
                            @click="showPacks = 'all'">
                        All
                    </cg-button>
                    <cg-button
                            :button-style="showPacks === 'created' ? 'tab-active' : 'tab-inactive'"
                            @click="showPacks = 'created'">
                        Created by You
                    </cg-button>
                </div>
                <asset-packs-pagination
                        :asset-pack-ids="assetPackIds"
                        :asset-packs-type="`asset-packs-${showPacks}`"
                        :show-per-page="16"
                        :overlay="true"
                        grid="row-4"
                />
            </div>
        </div>
    </div>
</template>

<script>

  import AssetPacksPagination from '../Profile/template/AssetPacksPagination.vue';
  import { mapGetters, mapActions } from 'vuex';
  import {
    METAMASK_ADDRESS,
    SET_CREATED_ASSETS_PACKS_IDS,
    SET_BOUGHT_ASSETS_PACKS_IDS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS,
  } from 'store/user-config/types';
  import { getNumberOfAssetPacks } from 'services/ethereumService';

  export default {
    name: 'AssetsPacksPage',
    components: {
      AssetPacksPagination
    },
    data() {
      return {
        showPacks: 'all',
        assetPackIds: [],
      };
    },
    beforeMount() {
      this[SET_CREATED_ASSETS_PACKS_IDS]();
      this[SET_BOUGHT_ASSETS_PACKS_IDS]();
    },
    computed: {
      ...mapGetters({
        metamaskAddress: METAMASK_ADDRESS,
        createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
      })
    },
    watch: {
      createdPacksIDs: async function (val) {
        if (this.showPacks === 'created') this.getAssetPacks();
      },
      showPacks: async function (val) {
        this.getAssetPacks();
      }
    },
    methods: {
      ...mapActions({
        SET_CREATED_ASSETS_PACKS_IDS,
        SET_BOUGHT_ASSETS_PACKS_IDS
      }),
      async getAssetPacks() {
        if (this.showPacks === 'created') {
          this.assetPackIds = this.createdPacksIDs;
        } else if (this.showPacks === 'all') {
          const numOfAssetPacks = parseInt(await getNumberOfAssetPacks());
          this.assetPackIds = [...Array(numOfAssetPacks).keys()].reverse();
        }
      },
    },
    async created() {
      this.getAssetPacks();
    }
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

    .assets {
        margin-bottom: 30px;
    }

    .asset-packs-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    .asset-pack-description {
        max-width: 550px;
    }

    .all-assets-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 0;

        .large-title {
            margin: 0;
        }
    }

    .line-separator {
        margin-bottom: 30px;
    }
</style>