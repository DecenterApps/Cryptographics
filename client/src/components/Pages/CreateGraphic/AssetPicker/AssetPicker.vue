<template>
    <div class="asset-picker">
        <div class="header">
            <h2 class="large-title">Select Asset Packs</h2>
            <div>
                <!--<button-icon icon-type="zoom" color="#000" size="15px" />-->
            </div>
        </div>
        <p class="page-description">
            Please select the asset packs that you want to include in your cryptographic. You can select as many asset
            packs as you want, but please note that a random number of assets will be included in a cryptographic, with
            the maximum always being 30. You only have to buy an Asset pack once and you can reuse it for any number of
            cryptographics afterwards.
        </p>
        <separator />
        <div class="filter-section">
            <div>
                <cg-button
                        :button-style="showPacks === 'all' ? 'tab-active' : 'tab-inactive'"
                        @click="toggleAssetPacks('all')">
                    All
                </cg-button>
                <cg-button
                        :button-style="showPacks === 'bought' ? 'tab-active' : 'tab-inactive'"
                        @click="toggleAssetPacks('bought')">
                    Bought
                </cg-button>
                <cg-button
                        :button-style="showPacks === 'created' ? 'tab-active' : 'tab-inactive'"
                        @click="toggleAssetPacks('created')">
                    Created by You
                </cg-button>
            </div>
        </div>
        <div class="content" v-if="loading === false">
            <asset-picker-pagination
                    assets-pack-type="all"
                    grid="row-5"
                    :show-per-page="12"
                    :overlay="true"
                    :isSelected="isSelected.bind(this)"
                    :toggleAsset="toggleAsset.bind(this)"
                    :selectedAssetPacks="selectedAssetPacks"
                    :changeStep="changeStep.bind(this)"
                    :assetPackIds="assetPacks"
                    :totalPrice="totalPrice"
            />
        </div>
        <div class="content" v-if="loading">
            <div class="loading-section">
                <loader />
            </div>
        </div>

    </div>
</template>

<script>
  import Decimal from 'decimal.js';
  import AssetPickerPagination from '../template/AssetPickerPagination.vue';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import {
    TOGGLE_ASSET_PACK,
    SELECTED_ASSET_PACKS,
  } from 'store/canvas/types';
  import { mapGetters, mapActions } from 'vuex';
  import {
    getNumberOfAssetPacks,
    getAssetPacksWithAssetData,
    getSelectedAssetPacksWithAssetData
  } from 'services/ethereumService';

  export default {
    name: 'AssetPicker',
    data: () => ({
      allAssetPacks: [],
      showPacks: 'all',
      loading: true,
    }),
    components: { AssetPickerPagination },
    computed: {
      ...mapGetters({
        createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS,
        selectedAssetPacks: SELECTED_ASSET_PACKS,
      }),
      totalPrice() {
        const filteredPacks = this.selectedAssetPacks.filter(item => {
          return !(this.createdPacksIDs.findIndex(id => parseInt(id, 10) === item.id) >= 0 ||
            this.boughtPacksIDs.findIndex(id => parseInt(id, 10) === item.id) >= 0);
        });
        return filteredPacks.reduce((acc, item) => Decimal(acc).plus(item.price).toString(), '0');
      },
      assetPacks() {
        if (this.showPacks === 'created') return this.createdPacksIDs;
        if (this.showPacks === 'bought') return this.boughtPacksIDs;
        return this.allAssetPacks;
      }
    },
    methods: {
      ...mapActions({
        toggleAsset: TOGGLE_ASSET_PACK,
      }),
      changeStep() {
        this.$emit('stepChange', 1);
      },
      isSelected(asset) {
        return this.selectedAssetPacks.findIndex(item => parseInt(item.id) === parseInt(asset.id)) >= 0;
      },
      toggleAssetPacks(toShow) {
        this.showPacks = toShow;
      },
    },

    async created() {
      try {
        const numOfAssets = await getNumberOfAssetPacks();
        this.allAssetPacks = [...Array(parseInt(numOfAssets)).keys()].reverse();
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">

    .asset-picker {
        width: 100%;
    }

    .line-separator {
        margin: 30px 0;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .large-title {
            margin-bottom: 0;
        }
        .ico-button {
            margin-right: 22px;
        }
    }

    .page-description {
        font-family: Roboto, sans-serif;
        font-size: 12px;
        color: #717171;
        margin-top: 30px;
        margin-bottom: 0;
        max-width: 650px;
        font-weight: 300;
        line-height: 19px;
    }

    .filter-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        button {
            margin-right: 20px;
        }
    }

    .loading-section {
        width: 100%;
        height: 277px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #CECECE;
        margin-top: 30px;
    }
</style>