<template>
    <div class="create-art-wrapper" v-bind:class="[activeTab === 'create' ? 'create' : '']">
        <div class="container create-container">
            <art-builder v-if="activeTab === 'create'" v-on:tabChange="changeTab"></art-builder>
            <asset-picker v-if="activeTab === 'picker'" v-on:tabChange="changeTab"></asset-picker>
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
      assets: [],
    }),
    methods: {
      changeTab(tab) {
        this.activeTab = tab;
      }
    }
  };
</script>

<style scoped lang="scss">
    .create-art-wrapper {
        background-color: #D9D9D9;
        min-height: calc(100vh - 70px);

        &.create {
            display: flex;
        }

        .create-container {
            padding: 40px 0;
            box-sizing: border-box;
        }
    }
</style>