<template>
    <layout layout-style="pulled-left" layout-content="no-container">
        <asset-picker
                v-if="activeTab === 'picker'"
                v-on:tabChange="changeTab" />
        <graphic-builder
                v-if="activeTab === 'create'"
                v-on:tabChange="changeTab" />
    </layout>
</template>

<script>
  import AssetPicker from './AssetPicker/AssetPicker.vue';
  import GraphicBuilder from './GraphicBuilder/GraphicBuilder.vue';
  import { SELECTED_ASSET_PACKS } from 'store/canvas/types';
  import { mapGetters } from 'vuex';

  export default {
    name: 'CreateGraphic',
    components: {
      GraphicBuilder,
      AssetPicker
    },
    data: () => ({
      activeTab: 'picker',
    }),
    computed: {
      ...mapGetters({
        selectedAssetPacks: SELECTED_ASSET_PACKS,
      })
    },
    methods: {
      changeTab(tab) {
        this.activeTab = tab;
      },
    },
    created() {
      if (this.selectedAssetPacks.length > 0)
        this.activeTab = 'create';

      // TODO delete sessionStorage check now because selectedAssetPacks is in store?
      // if (window.sessionStorage.length > 0) {
      //   this.activeTab = 'create';
      //   const landingPacks = getLandingPacks();
      //   this.selectedAssetPacks = [...new Set([...this.selectedAssetPacks, ...landingPacks.packs])];
      // }
    }
  };
</script>

<style scoped lang="scss">
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

        @media all and (max-width: 1280px) {
            width: 100%;
            left: 0;
            .create-container {
                margin-right: auto;
            }
        }
    }
</style>