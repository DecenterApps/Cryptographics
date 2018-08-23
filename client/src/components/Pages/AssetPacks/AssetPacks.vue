<template>
  <div class="all-assets-page">
    <slider-gallery/>
    <div class="container">
      <div class="all-assets-header">
        <h1 class="large-title">Asset Packs</h1>
        <button-link to="/upload-asset-pack">Create Asset Pack</button-link >
      </div>
      <div class="assets">
        <div class="button-group">
          <cg-button
            :button-style="showYourPacks === true ? 'negative' : 'transparent'"
            @click="showYourPacks = true">
            All assets packs
          </cg-button>
          <cg-button
            :button-style="showYourPacks === false ? 'negative' : 'transparent'"
            @click="showYourPacks = false">
            Your assets packs
          </cg-button>
        </div>
        <assets-pack-pagination
          v-if="showYourPacks"
          assets-pack-type="all"
          grid="row-4"
          :show-per-page="8"
          :overlay="true"/>
        <assets-pack-pagination
          v-else
          assets-pack-type="created"
          grid="row-4"
          :show-per-page="8"
          :overlay="true"/>
      </div>
    </div>
  </div>
</template>

<script>

import AssetsPackPagination from '../Profile/template/AssetsPackPagination.vue';

export default {
  name: 'AssetsPacksPage',
  components: {
    AssetsPackPagination
  },
  data() {
    return {
      showYourPacks: true,
    }
  }
};
</script>

<style scoped lang="scss">
    img {
        margin-right: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 150px;
        height: 150px;
    }
    .assets {
      margin-bottom: 30px;
    }
    .asset-packs-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    .all-assets-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
            text-decoration: none;
        }

        .button-wrapper {
            width: 140px;
        }

    }

    .large-title {
        margin-top: 29px;
        margin-bottom: 41px;
    }
</style>