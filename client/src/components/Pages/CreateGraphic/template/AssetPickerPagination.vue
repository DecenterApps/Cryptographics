<template>
    <div>
        <div class="selected-asset-packs">
            <div class="large-title">Selected asset packs:</div>

            <div class="packs-wrapper" v-if="selectedAssetPacks.length > 0">
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
                <div class="empty-asset-box"><div></div></div>
            </div>

            <separator />
        </div>

        <div v-if="loading" class="loading-section">
            <loader />
        </div>

        <div class="asset-packs" v-if="assetPacks !== false && this.loading === false" :class="grid">
            <asset-box
                    :assetPack="assetPack"
                    :selected="isSelected(assetPack)"
                    @click="toggleAsset(assetPack)"
                    v-for="(assetPack, index) in assetPacks" :key="index"
                    @mouseenter="setHover(assetPack)"
                    @mouseleave="setHover(false)"
            />
        </div>

        <div class="meta-info">
            <div class="hover-info">
                <h1 class="small-title" v-if="this.hovered">{{this.hovered.packName}} — <price size="inherit" :value="this.hovered.price" /></h1>
            </div>
            <div class="price-section">
                <h1 v-if="totalPrice > 0" class="small-title">Total price — <price size="inherit" :value="totalPrice"/></h1>
            </div>
        </div>

        <div class="bottom-controls">
            <div>
                <pagination
                    :total="assetPackIds === null ? 0 : assetPackIds.length"
                    :per-page="showPerPage"
                    pagination-style="left"
                    @updatePage="changePage" />
            </div>

            <cg-button :disabled="selectedAssetPacks.length === 0" @click="changeStep" button-style="primary">
                Next
            </cg-button>
        </div>
    </div>
</template>

<script>
  import {
    getSelectedAssetPacksWithAssetData,
  } from 'services/ethereumService';
  import { paginateArray } from 'services/helpers';
  import { mapGetters } from 'vuex';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { ipfsNodePath } from 'config/constants';

  export default {
    name: 'AssetPickerPagination',
    props: {
      showPerPage: {
        type: Number,
        default: 10
      },
      grid: {
        type: String,
        default: 'row-2'
      },
      overlay: {
        type: Boolean,
        default: false
      },
      assetPackIds: {
        type: Array,
        default: []
      },
      isSelected: {
        type: Function,
        default: () => {},
      },
      toggleAsset: {
        type: Function,
        default: () => {},
      },
      changeStep: {
        type: Function,
        default: () => {},
      },
      totalPrice: {
        type: String,
        default: 0,
      },
      selectedAssetPacks: {
        type: Array,
        default: [],
      }
    },
    data() {
      return {
        ipfsNodePath,
        loading: false,
        hovered: false,
      };
    },
    computed: {
      ...mapGetters({
        metamaskAddress: METAMASK_ADDRESS,
      })
    },
    asyncComputed: {
      assetPacks: {
        async get() {
          this.loading = true;
          const selectedPacks = paginateArray(this.assetPackIds, 1, this.showPerPage);
          const assetPacks = await getSelectedAssetPacksWithAssetData(selectedPacks);
          this.loading = false;
          return assetPacks;
        },
        watch() {
          this.metamaskAddress;
        }
      },
    },
    methods: {
      async changePage(currentPage) {
        this.loading = true;
        const selectedPacks = paginateArray(this.assetPackIds, currentPage, this.showPerPage);
        this.assetPacks = await getSelectedAssetPacksWithAssetData(selectedPacks);
        this.loading = false;
      },
      setHover(assetPack) {
        console.log(assetPack);
        this.$set(this, 'hovered', assetPack);
      }
    }
  };
</script>

<style scoped lang="scss">
    .asset-packs, .selected-asset-packs .packs-wrapper {
        min-width: 768px;
        display: flex;
        flex-wrap: wrap;

        @media screen and (max-width: 1120px) {
            min-width: 720px;
        }
        .asset-box {
            /*flex: 0 0 16%;*/
            margin-right: 26px;
            margin-bottom: 20px;

            &:nth-child(6n) {
                margin-right: 0;
            }
        }
    }

    .selected-asset-packs {
        margin-bottom: 20px;

        .large-title {
            font-size: 20px;
        }

        .packs-wrapper, .empty-packs-wrapper {
            margin-bottom: 20px;
        }

        .empty-packs-wrapper {

            .empty-asset-box {
                height: 120px;
                width: 165px;
                border: 4px solid #D9D9D9;

                div {
                    height: 100%;
                    border: 1px solid black;
                }
            }
        }
    }

    button {
        width: 85px;
    }

    .meta-info {
        .price-section, .hover-info {
            height: 18px;
            span {
                font-weight: normal;
                font-size: 16px;
            }
        }

        .price-section .small-title, .hover-info, .small-title {
            display: flex;

            .price {
                max-width: 55px;

                &:before { top: 2px; }
            }
        }
    }

    .meta-info,
    .bottom-controls {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
    }

    .loading-section {
        width: 100%;
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #CECECE;
        margin-top: 30px;
    }
</style>