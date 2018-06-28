<template>
    <div class="background-wrapper">
        <div class="black-bg"></div>
        <div class="create-art-wrapper" v-bind:class="[activeTab === 'create' ? 'create' : '']">
            <div class="container create-container">
                <art-builder
                        v-if="activeTab === 'create'"
                        v-on:tabChange="changeTab"
                        :selectedAssetPacks="selectedAssetPacks"
                ></art-builder>
                <asset-picker
                        v-if="activeTab === 'picker'"
                        v-on:tabChange="changeTab"
                        v-on:pickAsset="toggleAsset"
                        :selectedAssetPacks="selectedAssetPacks"
                ></asset-picker>
            </div>
        </div>
    </div>
</template>

<script>
  import AssetPicker from './AssetPicker/AssetPicker.vue';
  import ArtBuilder from './ArtBuilder/ArtBuilder.vue';

  export default {
    name: 'create-art',
    components: { ArtBuilder, AssetPicker },
    data: () => ({
      activeTab: 'create',
      selectedAssetPacks: [],
    }),
    methods: {
      changeTab(tab) {
        this.activeTab = tab;
      },
      toggleAsset(asset) {
        const index = this.selectedAssetPacks.findIndex(item => item.id === asset.id);
        if (index >= 0) {
          return this.selectedAssetPacks = [
            ...this.selectedAssetPacks.slice(0, index),
            ...this.selectedAssetPacks.slice(index + 1),
          ];
        }
        this.selectedAssetPacks.push(asset);
      }
    }
  };
</script>

<style scoped lang="scss">
    .background-wrapper {
        width: 100%;
        position: relative;
        .black-bg {
            position: absolute;
            top: 0;
            height: 350px;
            width: 100%;
            background-color: #000;
            margin: 0 auto;
            z-index: -1;
            overflow: hidden;
        }
    }

    .create-art-wrapper {
        background-color: #D9D9D9;
        min-height: calc(100vh - 70px);
        position: relative;
        width: 1280px;
        margin: 0 auto;
        left: -80px;

        &.create {
            display: flex;
        }

        .create-container {
            padding: 40px 0;
            box-sizing: border-box;
            margin-right: 0;
            overflow: hidden;
        }
    }
</style>