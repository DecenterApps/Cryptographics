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
                    v-for="(assetPack, index) in assetPacks" :key="index" />
            <keep-alive>

            </keep-alive>
        </div>
        <div class="bottom-controls">
            <pagination
                    :total="assetPackIds === null ? 0 : assetPackIds.length"
                    :per-page="showPerPage"
                    pagination-style="left"
                    @updatePage="changePage" />
            <cg-button
                    @click="changeTab"
                    button-style="negative">
                Done
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
      changeTab: {
        type: Function,
        default: () => {},
      }
    },
    data() {
      return {
        ipfsNodePath,
        loading: false,
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
      }
    }
  };
</script>

<style scoped lang="scss">
    .asset-packs {
        min-width: 768px;
        margin-bottom: 50px;
        display: flex;
        flex-wrap: wrap;

        @media screen and (max-width: 1120px) {
            min-width: 720px;
        }
        .asset-box {
            /*flex: 0 0 16%;*/
            margin-right: 20px;
            margin-bottom: 20px;

            &:nth-child(6n) {
                margin-right: 0;
            }
        }
    }

    .bottom-controls {
        display: flex;
        justify-content: space-between;
    }

    .loading-section {
        width: 100%;
        height: 470px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #CECECE;
        margin-top: 30px;
    }
</style>