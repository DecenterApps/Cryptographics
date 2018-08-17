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
        <div class="filter-section">
            <div>
                <cg-button
                        :button-style="showYourPacks === false ? 'negative' : 'transparent'"
                        @click="toggleAssetPacks">
                    All asset packs
                </cg-button>
                <cg-button
                        :button-style="showYourPacks === true ? 'negative' : 'transparent'"
                        @click="toggleAssetPacks">
                    Your asset packs
                </cg-button>
            </div>
            <div class="price-section">
                <h1 class="small-title">Total price - {{ totalPrice() }} Ξ</h1>
            </div>
        </div>
        <div class="content">
            <div class="asset-packs">
                <asset-box
                        :assetPack="assetPack"
                        :selected="isSelected(assetPack)"
                        @click="toggleAsset(assetPack)"
                        v-for="(assetPack, index) in assetPacks" :key="index" />
            </div>
            <cg-button
                    @click="changeTab"
                    button-style="transparent">
                Next
            </cg-button>
        </div>

    </div>
</template>

<script>
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import {
    getAssetPacksWithAssetData,
    getSelectedAssetPacksWithAssetData
  } from 'services/ethereumService';

  export default {
    name: 'AssetPicker',
    data: () => ({
      assetPacks: [],
      showYourPacks: false,
    }),
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
        return this.selectedAssetPacks.findIndex(item => item.id === asset.id) >= 0;
      },
      toggleAsset(asset) {
        this.$emit('pickAsset', asset);
      },
      async toggleAssetPacks() {
        this.showYourPacks = !this.showYourPacks;
        if (this.showYourPacks) {
          this.assetPacks = await getSelectedAssetPacksWithAssetData([
            ...this.createdPacksIDs,
            ...this.boughtPacksIDs
          ]);
        } else {
          this.assetPacks = await getAssetPacksWithAssetData();
        }
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
      this.assetPacks = await getAssetPacksWithAssetData();
    }
  };
</script>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        max-width: 760px;
        margin-left: 0;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 50px;
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

            .button-wrapper {
                .button {
                    width: 130px;
                }

                &:first-child {
                    margin-right: 20px;
                }
            }
        }
        .asset-packs {
            margin-bottom: 50px;
            .asset-box {
                cursor: pointer;
                margin-right: 20px;
                margin-bottom: 20px;
                &.selected {
                    border: 1px solid #000;
                }
            }
        }
    }
</style>