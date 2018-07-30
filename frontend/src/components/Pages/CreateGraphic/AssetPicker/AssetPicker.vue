<template>
    <div class="container">
        <div class="header">
            <h2 class="large-title">Select Asset Pack</h2>
            <div>
                <button-icon icon-type="zoom" color="#000" size="15px" />
                <cg-button
                        @click="changeTab"
                        button-style="transparent">
                    Back
                </cg-button>
            </div>
        </div>
        <div class="content">
            <div class="asset-packs">
                <asset-circle
                        :name="asset.id"
                        color="#eee"
                        :class="[isSelected(asset), 'asset-pack-circle']"
                        @click="toggleAsset(asset)"
                        v-for="(asset, index) in assetPacks" :key="index" />
            </div>
            <cg-button
                    @click="changeTab"
                    button-style="transparent">
                Select
            </cg-button>
        </div>

    </div>
</template>

<script>

  import {
    getNumberOfAssetPacks,
    getAssetPackData,
  } from 'services/ethereumService';

  export default {
    name: 'AssetPicker',
    data: () => ({
      assetPacks: [],
    }),
    props: ['selectedAssetPacks'],
    methods: {
      changeTab() {
        this.$emit('tabChange', 'create');
      },
      isSelected(asset) {
        return this.selectedAssetPacks.findIndex(item => item.id === asset.id) >= 0 ? ['selected'] : '';
      },
      toggleAsset(asset) {
        this.$emit('pickAsset', asset);
      }
    },

    async beforeCreate() {
      let assetPacksLength = await getNumberOfAssetPacks();
      console.log('Number Of packs' + assetPacksLength);
      for (let i = 0; i < assetPacksLength; i++) {
        let data = await getAssetPackData(i);
        let obj = {
          id: i,
          data: data,
        };
        this.assetPacks.push(obj);
      }
      console.log(this.assetPacks);
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
        .asset-packs {
            margin-bottom: 20px;
            .asset-pack-circle {
                cursor: pointer;
                margin-right: 10px;
                margin-bottom: 10px;
                &.selected {
                    border: 1px solid #000;
                }
            }
        }
    }
</style>