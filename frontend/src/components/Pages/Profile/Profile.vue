<template>
    <div class="profile-page">
        <slider-gallery />
        <div class="container">
            <div class="profile">
                <div class="header">
                  <img class="avatar">
                  <div class="left">
                    <h1 class="name">Anon</h1>
                  </div>
                  <div class="right">
                    <cg-button 
                      button-style="transparent"
                      @click="openModal('editProfile')">
                      Edit Profile
                    </cg-button>
                    <button-link
                      to="/upload-asset-pack">
                      Create Asset Pack
                    </button-link>
                  </div>
                </div>

                <p class="large-title">Asset Packs</p>
                <asset-packs-pagination :show-all="true" />
                <p class="large-title">Gallery</p>
            </div>
            <h3> My profile </h3>
            <div>
                <div>
                    <label> Metamask account : {{this.metamask_account}}</label>
                </div>
                <div>
                    <label> My bought assets : {{this.bought_assets}}</label>
                </div>
                <div>
                    <label> Assets I've created: {{this.created_assets}}</label>
                </div>
                <div>
                    <label> Asset Packs I've created : {{ this.asset_packs}}</label>
                </div>
                <div>
                    <label> My images on chain: {{this.my_images_on_chain}}</label>
                </div>
                <div>
                    <button @click="generateData"> Generate data</button>
                </div>
                <div>
                    <button @click="renderMyImagesCanvas"> View image</button>
                    <input placeholder="Type id of your image: " v-model="id_to_show" />
                </div>
                <gallery :images="images" />
            </div>
        </div>
    </div>
</template>

<script>
  import {
    getUserImages,
    getBoughtAssets,
    getCreatedAssetPacks,
    getImageMetadataFromContract,
    getImageIpfs,
  } from 'services/ethereumService';
  import { getData, loadDataForAssets } from 'services/imageService';
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';

  import MyImages from './MyImages.vue';
  import MyImageees from './MyImageees.vue';
  import AssetPacksPagination from 'shared/AssetPacksPagination/AssetPacksPagination.vue';
  import Gallery from 'shared/Gallery/Gallery.vue';

  export default {
    name: 'profile',
    data: () => ({
      asset_packs: [],
      allAssetPaths: [],
      id_to_show: -1,
      metamask_account: 0,
      allAssets: [],
      images: [],
      my_images_on_chain: [],
      bought_assets: [],
      created_assets: [],
      myobjects: [],
    }),
    components: {
      Gallery,
      canvasMyImages: MyImages,
      myImagesIpfs: MyImageees,
      AssetPacksPagination
    },
    // computed: {
    // },
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
        this.my_images_on_chain = await getUserImages(this.metamask_account);
      },
      async getBoughtAssets() {
        this.bought_assets = await getBoughtAssets(this.metamask_account);
        this.bought_assets = this.bought_assets.sort(function (a, b) {return a - b;});
      },

      async getAllAssets() {
        this.allAssets = await loadDataForAssets();
      },

      async getAssetPacks() {
        this.asset_packs = await getCreatedAssetPacks(this.metamask_account);
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
        this.myobjects = await getData(data[0], parseInt(data[1], 10), data[2], this.allAssets);
      },

      async getImages() {
        let images = await getUserImages(this.metamask_account);
        let prefix = 'https://ipfs.decenter.com/ipfs/';
        let hashes = [];
        for (let i = 0; i < images.length; i++) {
          let hash = await getImageIpfs(images[i]);
          hashes.push({
            address: this.metamask_account,
            src: prefix + hash,
            name: 'The point of',
            price: 0.45,
          });
        }
        this.images = hashes;
      }
    },

    async beforeMount() {
      web3.eth.getAccounts((err, acc) => {
        if (err) return console.error(err);
        this.metamask_account = acc[0];
        this.generateData();
      });

      await this.getImages();
    }

  };

</script>

<style scoped lang="scss">
.header {
  padding-left: 190px;
  padding-top: 47px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  .avatar {
    background-color: #333;
    width: 160px; height: 160px;
    position: absolute;
    top: -80px;
    left: 0;
  }
  .name {
    font-family: 'YoungSerif-Regular', sans-serif;
    font-size: 32px;
  }
}


    .profile-page {
        background-color: #F9F9F9;

        .profile {
            position: relative;
            .thumbnail {
                position: absolute;
                top: -96px;
                width: 160px;
                height: 160px;
                background-color: #D4D4D4;
            }

            .description {
                display: flex;
                padding: 32px 0;
                justify-content: flex-end;
                font-family: 'YoungSerif-Regular', sans-serif;
                font-size: 15px;
                align-items: flex-end;
                line-height: 15px;

                .creator-name {
                    font-size: 32px;
                    line-height: 32px;
                    margin-left: 15px;
                }
            }
        }

        .home-gallery {
            background-color: none;
            margin: 40px 0;
        }
    }
</style>