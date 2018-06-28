<template>
    <div class="asset-picker">
        <div class="asset-picker-header">
            <span class="large-title">Select Asset Pack</span>
            <div>
                <button v-on:click="changeTab" class="default-button">Back</button>
            </div>
        </div>
        <div class="asset-packs">
            <div v-bind:class="[isSelected(asset), 'asset-pack-circle']" v-on:click="toggleAsset(asset)" v-for="asset in assets">
                {{ asset.name }}
            </div>

            <button v-on:click="changeTab" class="default-button no-background">
                Select
            </button>
        </div>
    </div>
</template>

<script>
    const functions = require('../../../../scripts/functions.js')

    export default {
    name: 'asset-picker',
    data: () => ({
      assets: [],
      selectedAssets: []
    }),
    methods: {
      changeTab() {
        this.$emit('tabChange', 'create');
      },
      isSelected(asset) {
        return this.selectedAssets.findIndex(item => item.id === asset.id) >= 0 ? ['selected'] : '';
      },
      toggleAsset(asset) {
        const index = this.selectedAssets.findIndex(item => item.id === asset.id);
        if (index >= 0) {
          return this.selectedAssets = [
            ...this.selectedAssets.slice(0, index),
            ...this.selectedAssets.slice(index + 1),
          ];
        }
        this.selectedAssets.push(asset);
      }
    },

    async beforeCreate() {
        let assetPacksLength = await functions.getNumberOfAssetPacks();
        for(let i=0; i<assetPacksLength; i++){
            let data = await functions.getIpfsAndIdsForAssetPack(i);
            let obj = {
                id : i,
                data : data,
            };
            this.assets.push(obj);
        }
        console.log(this.assets);
    }
  };
</script>

<style scoped lang="scss">
    .asset-picker {
        .asset-picker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 760px;
            margin-bottom: 50px;

            .default-button {
                background: #D9D9D9;
                border: 1px solid #000;
            }
        }

        .asset-packs {
            max-width: 510px;

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