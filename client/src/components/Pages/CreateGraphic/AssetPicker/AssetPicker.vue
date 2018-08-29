<template>
    <div class="container">
        <div class="header">
            <h2 class="large-title">Select Asset Pack</h2>
            <div>
                <button-icon icon-type="zoom" color="#000" size="15px" />
                <!--<cg-button-->
                <!--@click="changeTab"-->
                <!--button-style="transparent">-->
                <!--Back-->
                <!--</cg-button>-->
            </div>
        </div>
        <separator />
        <div class="filter-section">
            <div>
                <cg-button
                        :button-style="showYourPacks === false ? 'tab-active' : 'tab-inactive'"
                        @click="toggleAssetPacks">
                    All asset packs
                </cg-button>
                <cg-button
                        :button-style="showYourPacks === true ? 'tab-active' : 'tab-inactive'"
                        @click="toggleAssetPacks">
                    Your asset packs
                </cg-button>
            </div>
            <div class="price-section">
                <h1 class="small-title">Total price - {{ totalPrice() }} Ξ</h1>
            </div>
        </div>
        <div class="content" v-if="loading === false">
            <asset-picker-pagination
                    assets-pack-type="all"
                    grid="row-5"
                    :show-per-page="10"
                    :overlay="true"
                    :isSelected="isSelected.bind(this)"
                    :toggleAsset="toggleAsset.bind(this)"
                    :changeTab="changeTab.bind(this)"
                    :assetPackIds="assetPacks"
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
  import AssetPickerPagination from '../template/AssetPickerPagination.vue';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import {
    getNumberOfAssetPacks,
    getAssetPacksWithAssetData,
    getSelectedAssetPacksWithAssetData
  } from 'services/ethereumService';

  export default {
    name: 'AssetPicker',
    data: () => ({
      assetPacks: [],
      showYourPacks: false,
      loading: true,
    }),
    components: { AssetPickerPagination },
    computed: {
      ...mapGetters({
        createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS
      })
    },
    props: ['selectedAssetPacks'],
    methods: {
      changeTab() {
        this.$emit('tabChange', 'create');
      },
      isSelected(asset) {
        return this.selectedAssetPacks.findIndex(item => parseInt(item.id) === parseInt(asset.id)) >= 0;
      },
      toggleAsset(asset) {
        this.$emit('pickAssetPack', asset);
      },
      async toggleAssetPacks() {
        this.showYourPacks = !this.showYourPacks;
        this.loading = true;
        if (this.showYourPacks) {
          this.assetPacks = [
            ...this.createdPacksIDs,
            ...this.boughtPacksIDs
          ];
        } else {
          const numOfAssets = await getNumberOfAssetPacks();
          this.assetPacks = [...Array(parseInt(numOfAssets)).keys()];
        }
        this.loading = false;
      },
      totalPrice() {
        const filteredPacks = this.selectedAssetPacks.filter(item => {
          return !(this.createdPacksIDs.findIndex(id => parseInt(id, 10) === item.id) >= 0 ||
            this.boughtPacksIDs.findIndex(id => parseInt(id, 10) === item.id) >= 0);
        });
        return filteredPacks.reduce((acc, item) => acc + parseFloat(item.price), 0);
      }
    },

    async created() {
      try {
        const numOfAssets = await getNumberOfAssetPacks();
        this.assetPacks = [...Array(parseInt(numOfAssets)).keys()];
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        max-width: 760px;
        margin-left: 0;
        justify-content: flex-start !important;

        .line-separator {
            margin: 25px 0;
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
        .filter-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            button {
                min-width: 130px;

                &:first-child {
                    margin-right: 20px;
                }
            }
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