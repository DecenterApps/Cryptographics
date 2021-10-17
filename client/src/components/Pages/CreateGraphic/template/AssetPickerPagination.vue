<template>
  <div>
    <div v-if="loading" class="loading-section">
      <loader/>
      <h3>Please wait, we are loading asset packs from the blockchain and IPFS.</h3>
    </div>

    <div class="asset-packs" v-if="assetPacks !== false && this.loading === false" :class="grid">
      <asset-box
        :assetPack="assetPack"
        :selected="isSelected(assetPack)"
        @click="toggleAsset(assetPack)"
        v-for="(assetPack, index) in assetPacks"
        :key="index"
        @mouseenter="setHover(assetPack)"
        @mouseleave="setHover(false)"
      />
      <div class="meta-info">
        <div class="hover-info">
          <h1 class="small-title" v-if="this.hovered">
            {{this.hovered.packName}} —
            <price size="medium" :show-if-free="true" :value="this.hovered.price"/>
          </h1>
        </div>
      </div>
    </div>

    <div class="pagination">
      <pagination
        :total="assetPackIds === null ? 0 : assetPackIds.length"
        :per-page="showPerPage"
        pagination-style="left"
        @updatePage="changePage"
      />
    </div>
    <separator></separator>
    <div class="bottom-controls">
      <div class="price-section">
        <h1 v-if="totalPrice > 0" class="small-title">Total price —
          <price :value="totalPrice" size="medium"/>
        </h1>
      </div>

      <cg-button
        :disabled="selectedAssetPacks.length === 0"
        @click="changeStep"
        button-style="primary"
      >Next</cg-button>
    </div>
  </div>
</template>

<script>
import { getSelectedAssetPacksWithAssetData } from "services/ethereumService";
import { paginateArray } from "services/helpers";
import { mapGetters } from "vuex";
import {
  ADDRESS,
  CREATED_ASSETS_PACKS_IDS,
  BOUGHT_ASSETS_PACKS_IDS
} from "store/user-config/types";
import { ipfsNodePath } from "config/constants";

export default {
  name: "AssetPickerPagination",
  props: {
    showPerPage: {
      type: Number,
      default: 10
    },
    grid: {
      type: String,
      default: "row-6"
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
      default: () => {}
    },
    toggleAsset: {
      type: Function,
      default: () => {}
    },
    changeStep: {
      type: Function,
      default: () => {}
    },
    totalPrice: {
      type: String,
      default: 0
    },
    selectedAssetPacks: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      ipfsNodePath,
      loading: false,
      hovered: false
    };
  },
  computed: {
    ...mapGetters({
      address: ADDRESS
    })
  },
  asyncComputed: {
    assetPacks: {
      async get() {
        this.loading = true;
        const selectedPacks = paginateArray(
          this.assetPackIds,
          1,
          this.showPerPage
        );
        const assetPacks = await getSelectedAssetPacksWithAssetData(
          selectedPacks
        );
        this.loading = false;
        return assetPacks;
      },
      watch() {
        this.address;
      }
    }
  },
  methods: {
    async changePage(currentPage) {
      this.loading = true;
      const selectedPacks = paginateArray(
        this.assetPackIds,
        currentPage,
        this.showPerPage
      );
      this.assetPacks = await getSelectedAssetPacksWithAssetData(selectedPacks);
      this.loading = false;
    },
    setHover(assetPack) {
      this.$set(this, "hovered", assetPack);
    }
  }
};
</script>

<style scoped lang="scss">
.asset-packs,
.selected-asset-packs .packs-wrapper {
  position: relative;
  &.row-6 {
    .asset-box {
      width: 14.1%;
      margin-right: 3%;
      margin-bottom: 3%;
      height: auto;
      &:nth-of-type(6n) {
        margin-right: 0 !important;
      }
      &:nth-of-type(12n) {
        margin-right: 0 !important;
      }
      @media screen and (max-width: 1025px) {
        width: 22.7%;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
        &:nth-of-type(6n) {
          margin-right: 3% !important;
        }
      }
      @media screen and (max-width: 768px) {
        width: 31.3%;
        margin-bottom: 5%;
        &:nth-of-type(3n) {
          margin-right: 0;
        }
        &:nth-of-type(4n) {
          margin-right: 3%;
        }
        &:nth-of-type(6n) {
          margin-right: 0% !important;
        }
      }
      &:nth-of-type(12n) {
        margin-right: 0 !important;
      }
    }
  }
  // .asset-box {
  //     /*flex: 0 0 16%;*/
  //     margin-right: 26px;
  //     margin-bottom: 20px;

  //     &:nth-child(6n) {
  //         margin-right: 0;
  //     }
  // }

  // @media screen and (max-width: 1300px) {
  //     .asset-box {
  //         margin-right: 18px;
  //     }
  // }

  // @media screen and (max-width: 1120px) {
  //     min-width: 720px;
  //     justify-content: space-between;
  //     .asset-box {
  //         margin-right: 0;
  //     }
  // }

  // @media screen and (max-width: 768px) {
  //     min-width: auto;
  // }
}

button {
  min-width: 70px;
}

.line-separator {
  margin: 25px 0;
}

.meta-info {
  position: absolute;
  top: -68px;
  right: 0;
  @media screen and (max-width: 768px) {
    display: none !important;
  }
}

.meta-info,
.bottom-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;

  button {
    margin-left: 20px;
  }

  .price-section,
  .hover-info {
    height: 18px;

    .small-title {
      font-family: Roboto, sans-serif;
      font-size: 16px;
      font-weight: normal;
      display: flex;
      align-items: center;
      line-height: 25px;
    }
    span {
      margin-left: 5px;
    }
  }

  .price-section .small-title,
  .hover-info,
  .small-title {
    display: flex;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.loading-section {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #cecece;
  margin-top: 30px;
  text-align: center;
  padding: 10px;
  .loader-content {
    margin-bottom: 20px;
  }
}
</style>
