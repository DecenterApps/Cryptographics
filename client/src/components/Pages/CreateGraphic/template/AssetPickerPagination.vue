<template>
    <div>
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
            <div class="meta-info">
                <div class="hover-info">
                    <h1 class="small-title" v-if="this.hovered">{{this.hovered.packName}} —
                        <price size="inherit" :show-if-free="true" :value="this.hovered.price" />
                    </h1>
                </div>

            </div>
        </div>

        <div class="pagination">
            <pagination
                    :total="assetPackIds === null ? 0 : assetPackIds.length"
                    :per-page="showPerPage"
                    pagination-style="left"
                    @updatePage="changePage" />
        </div>
        <separator></separator>
        <div class="bottom-controls">
            <div class="price-section">
                <h1 v-if="totalPrice > 0" class="small-title">Total price —
                    <price size="inherit" :value="totalPrice" />
                </h1>
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
        this.$set(this, 'hovered', assetPack);
      }
    }
  };
</script>

<style scoped lang="scss">
    .asset-packs, .selected-asset-packs .packs-wrapper {
        position: relative;
        min-width: 768px;
        display: flex;
        flex-wrap: wrap;

        .asset-box {
            /*flex: 0 0 16%;*/
            margin-right: 26px;
            margin-bottom: 20px;

            &:nth-child(6n) {
                margin-right: 0;
            }
        }

        @media screen and (max-width: 1300px) {
            .asset-box {
                margin-right: 18px;
            }
        }

        @media screen and (max-width: 1120px) {
            min-width: 720px;
            justify-content: space-between;
            .asset-box {
                margin-right: 0;
            }
        }

        @media screen and (max-width: 767px) {
            min-width: auto;
        }
    }

    button {
        min-width: 70px;
    }

    .line-separator {
        margin: 25px 0;
    }

    .meta-info {
        position: absolute;
        top: -68px;
        right: 0;
        @media screen and (max-width: 767px) {
            display: none !important;
        }
    }

    .meta-info,
    .bottom-controls {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin: 20px 0;

        button {
            margin-left: 20px;
        }

        .price-section, .hover-info {
            height: 18px;

            .small-title {
                font-family: Roboto, sans-serif;
                font-size: 16px;
                font-weight: normal;
                display: flex;
                align-items: center;
                line-height: 25px;
            }
            span {
                font-weight: bold;
                font-size: 25px;
                display: flex;
                align-items: center;
                margin-left: 5px;
            }
        }

        .price-section .small-title, .hover-info, .small-title {
            display: flex;

            .price {
                /*max-width: 55px;*/

                &:before {
                    top: 2px;
                }
            }
        }
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
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