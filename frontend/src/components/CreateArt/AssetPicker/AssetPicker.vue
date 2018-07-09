<template>
    <div class="asset-picker">
        <div class="asset-picker-header">
            <span class="large-title">Select Asset Pack</span>
            <div>
                <button v-on:click="changeTab" class="default-button">Back</button>
            </div>
        </div>
        <div class="asset-packs">
            <div v-bind:class="[isSelected(asset), 'asset-pack-circle']" v-on:click="toggleAsset(asset)"
                 v-for="asset in assetPacks">
                {{ asset.id }}
            </div>

            <button v-on:click="changeTab" class="default-button no-background">
                Select
            </button>
        </div>
    </div>
</template>

<script>
  const functions = require('../../../../scripts/functions.js');

  export default {
    name: 'asset-picker',
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
      let assetPacksLength = await functions.getNumberOfAssetPacks();
      console.log("Number Of packs" + assetPacksLength);
      for (let i = 0; i < assetPacksLength; i++) {
        let data = await functions.getAssetPackData(i);
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