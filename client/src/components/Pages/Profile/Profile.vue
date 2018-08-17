<template>
  <layout
    layout-style="full-width"
    layout-content="no-container"
    :slider-gallery="true">
    <div class="container">
      <div class="header">
        <img v-if="avatar.length > 0" class="avatar" :src="ipfsNodePath + avatar">
        <div class="left">
          <h1 class="large-title name">{{ username }}</h1>
        </div>
        <div class="right button-group">
          <cg-button 
            button-style="transparent"
            v-if="userAddress"
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
        <template v-if="userAddress">
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
          <gallery :images="images" :display-overlay="true" />
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
    getImagesMetadata,
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
        images: [],
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
    watch: {
      userAddress: async function (val) {
        console.log(val);
        let ids = await getUserImages(val);
        this.images = await getImagesMetadata(ids);
      },
    },
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL
      }),
      async generateData() {
        await this.getImages();
      },
      async getImages() {
        if (!this.userAddress) return;
        let ids = await getUserImages(this.userAddress);
        this.images = await getImagesMetadata(ids);
      }
    },

    async created() {
      this.generateData();
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