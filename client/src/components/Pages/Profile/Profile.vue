<template>
  <layout
    layout-style="full-width"
    layout-content="no-container"
    :slider-gallery="true">
    <div class="container">
      <div class="header">
        <img class="avatar" :src="ipfsNodePath + avatar">
        <div class="left">
          <h1 class="large-title name">{{ username }}</h1>
        </div>
        <div class="right button-group">
          <cg-button 
            button-style="transparent"
            v-if="metamaskAddress"
            @click="openModal('editProfile')">
            Edit Profile
          </cg-button>
          <button-link
            to="/upload-asset-pack">
            Create Asset Pack
          </button-link>
        </div>
      </div>
      <div class="main">
        <template v-if="metamaskAddress">
        <div class="assets">
          <h2 class="large-title">Asset Packs</h2>
          <div class="button-group">
            <cg-button
              :button-style="showYourPacks === true ? 'negative' : 'transparent'"
              @click="showYourPacks = true">
              Your assets packs
            </cg-button>
            <cg-button
              :button-style="showYourPacks === false ? 'negative' : 'transparent'"
              @click="showYourPacks = false">
              Bought assets packs
            </cg-button>
          </div>
            <assets-pack-pagination v-if="showYourPacks" assets-pack-type="created"/>
            <assets-pack-pagination v-else assets-pack-type="bought"/>
        </div>
        <div class="gallery">
          <h2 class="large-title">Gallery</h2>
          <gallery :images="images"/>
        </div>
        </template>
        <template v-else>
          <p>Connect to MetaMask.</p>
        </template>
      </div>
    </div>
  </layout>
</template>

<script>
  import {
    getUserImages,
    getBoughtAssets,
    getCreatedAssetPacks,
    getImageMetadataFromContract,
    getImageIpfs,
  } from 'services/ethereumService';
  import { ipfsNodePath } from 'config/constants';
  import { getFinalAssets, loadDataForAssets } from 'services/imageService';
  import { mapActions, mapGetters } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import { USERNAME, METAMASK_ADDRESS, AVATAR } from 'store/user-config/types';

  import AssetsPackPagination from './template/AssetsPackPagination.vue';
  import Gallery from 'shared/Gallery/Gallery.vue';

  export default {
    name: 'Profile',
    data() {
      return {
        ipfsNodePath,
        showYourPacks: true,
        asset_packs: [],
        allAssetPaths: [],
        id_to_show: -1,
        allAssets: [],
        images: [],
        my_images_on_chain: [],
        bought_assets: [],
        created_assets: [],
        myobjects: [],
      }
    },
    components: {
      Gallery,
      AssetsPackPagination
    },
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
        username: USERNAME,
        avatar: AVATAR
      })
    },
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL
      }),
      async generateData() {
        await this.getImages();
        await this.getAllAssets();
        await this.getAssetPacks();
      },

      async getImages() {
        this.my_images_on_chain = await getUserImages(this.userAddress);
      },
      async getBoughtAssets() {
        this.bought_assets = await getBoughtAssets(this.userAddress);
        this.bought_assets = this.bought_assets.sort(function (a, b) {return a - b;});
      },

      async getAllAssets() {
        this.allAssets = await loadDataForAssets();
      },

      async getAssetPacks() {
        this.asset_packs = await getCreatedAssetPacks(this.userAddress);
      },

      async renderMyImagesCanvas() {
        if (this.id_to_show == -1) {
          return;
        }
        let found = false;
        for (let i = 0; i < this.my_images_on_chain.length; i++) {
          if (this.my_images_on_chain[i] == this.id_to_show) {
            found = true;
          }
        }

        if (!found) {
          this.id_to_show = -1;
          return;
        }
        let data = await getImageMetadataFromContract(this.id_to_show);
        this.myobjects = await getFinalAssets(data[0], parseInt(data[1], 10), data[2], this.allAssets);
      },

      async getImages() {
        let images = await getUserImages(this.userAddress);
        let hashes = [];
        for (let i = 0; i < images.length; i++) {
          let hash = await getImageIpfs(images[i]);
          hashes.push({
            address: this.userAddress,
            src: ipfsNodePath + hash,
            name: 'The point of',
            price: 0.45,
          });
        }
        this.images = hashes;
      }
    },

    async beforeMount() {
      this.generateData();
      await this.getImages();
    }

  };

</script>

<style scoped lang="scss">
.container {
  padding-top: 0 !important;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - 419px);
  .header {
    padding-left: 190px;
    padding-top: 47px;
    margin-bottom: 60px;
    display: flex;
    justify-content: space-between;
    .avatar {
      width: 160px; height: 160px;
      position: absolute;
      top: -80px;
      left: 0;
    }
    .left {
      .name {
        margin-bottom: 0;
      }
    }
  }
  .assets, .gallery {
    padding-bottom: 30px;
  }
  @media screen and (max-width: 1120px) {
    .header {
      padding-left: 0;
      padding-top: 127px;
      .avatar {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  @media screen and (max-width: 767px) {
    .header {
      flex-direction: column;
      text-align: center;
      .left {
        margin-bottom: 20px;
      }
    }
  }
}
</style>