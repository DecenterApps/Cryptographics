<template>
    <div class="asset-picker">
        <div class="header">
            <h2 class="large-title">Select Asset Packs</h2>
            <div id="tooltip-1" class="hidden" v-tippy-html>
                <p class="tooltip-content">Please select the asset packs that you want to include in your cryptographic. You can select as many asset packs as you want, but please note that a random number of assets will be included in a cryptographic, with the maximum always being 30. You only have to buy an Asset pack once and you can reuse it for any number of cryptographics afterwards.</p>
            </div>
            <button-icon
                iconType="info"
                classProp="info"
                v-tippy="{
                    html: '#tooltip-1',
                    interactive : true,
                    duration : 0,
                    animation : 'fade',
                    theme : 'cryptographics',
                    placement: 'left-start',
                    flipBehavior: ['left', 'bottom-end']
                }"
                class="info-btn"
            >
            </button-icon>
        </div>
        <separator />
        <div class="selected-asset-packs">
            <div class="large-title">Selected asset packs</div>

            <div class="packs-wrapper row-6" v-if="selectedAssetPacks.length > 0">
                <asset-box
                        :assetPack="assetPack"
                        :selected="isSelected(assetPack)"
                        @click="toggleAsset(assetPack)"
                        v-for="(assetPack, index) in selectedAssetPacks" :key="index"
                        @mouseenter="setHover(assetPack)"
                        @mouseleave="setHover(false)"
                />
            </div>

            <div class="empty-packs-wrapper" v-if="selectedAssetPacks.length === 0">
                <div class="empty-asset-box">
                    <div class="cover"></div>
                    <img src="https://ipfs.decenter.com/ipfs/QmYmu9gxQ6wbQXQmtBakTM3XifMs5u4gBrFQYNq8kVMhGh" />
                </div>
            </div>

            <separator />
        </div>
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
                    grid="row-6"
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
          return !(this.createdPacksIDs.findIndex(id => parseInt(id, 10) === parseInt(item.id, 10)) >= 0 ||
            this.boughtPacksIDs.findIndex(id => parseInt(id, 10) === parseInt(item.id, 10)) >= 0);
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

    .selected-asset-packs {
        margin-bottom: 20px;
        .row-6 {
            .asset-box {
                width: 14.1%;
                margin-right: 3%;
                margin-bottom: 3%;
                height: auto;
                &:nth-of-type(6n) {
                    margin-right: 0 !important;
                }
                &:nth-of-type(12n) {
                    margin-right: 0 !important;
                }
                @media screen and (max-width: 1025px) {
                    width: 22.7%;
                    &:nth-of-type(4n) {
                        margin-right: 0;
                    }
                    &:nth-of-type(6n) {
                        margin-right: 3% !important;
                        
                    }
                }
                @media screen and (max-width: 768px) {
                    width: 31.3%;
                    &:nth-of-type(3n) {
                        margin-right: 0;
                    }
                    &:nth-of-type(4n) {
                        margin-right: 3%;
                    }
                    &:nth-of-type(6n) {
                        margin-right: 0% !important;
                    }
                }
                &:nth-of-type(12n) {
                    margin-right: 0 !important;
                }
            }
        }

        .large-title {
            font-family: Roboto, sans-serif;
            font-weight: bold;
            line-height: normal;
            font-size: 15px;
            text-decoration-line: underline;
            color: #000000;
        }

        .empty-packs-wrapper {
            position: relative;
            .cover {
                position: absolute;
                background-color: #D9D9D9;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            .empty-asset-box {
                position: relative;
                height: 59%;
                width: 14.1%;
                margin-right: 3%;
                margin-bottom: 3%;
                border: 1px solid black;
                img {
                    width: 100%;
                    height: 100%;
                }
                @media screen and (max-width: 1025px) {
                    width: 22.7%;
                }
                @media screen and (max-width: 768px) {
                    width: 31.3%;
                }
            }
        }
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