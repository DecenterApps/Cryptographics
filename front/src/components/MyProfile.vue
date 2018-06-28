<template>
    <div class="profile-page">
        <slider-gallery></slider-gallery>


        <div class="container">
            <div class="profile">
                <div class="profile-image">
                    <div class="thumbnail"></div>
                </div>
                <div class="description">
                    <span class="creator-label">Creator:</span> <span class="creator-name">Anon</span>
                </div>

                <p class="large-title">Asset Packs</p>
                <my-assets v-if="metamask_account" :metamask_account="metamask_account"></my-assets>

                <p class="large-title">Gallery</p>
            </div>

            <!--<h3> My profile </h3>-->
            <!--<div>-->
                <!--<div>-->
                    <!--<label> Metamask account : {{this.metamask_account}}</label>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label> My bought assets : {{this.bought_assets}}</label>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label> Assets I've created: {{this.created_assets}}</label>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label> Asset Packs I've created : {{ this.asset_packs}}</label>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label> My images on chain: {{this.my_images_on_chain}}</label>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<button @click="generateData"> Generate data</button>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<button @click="renderMyImagesCanvas"> View image</button>-->
                    <!--<input placeholder="Type id of your image: " v-model="id_to_show" />-->
                <!--</div>-->

                <home-gallery></home-gallery>
            </div>
        </div>
    </div>
</template>

<script>
  import SliderGallery from './SliderGallery/SliderGallery.vue';
  import functions from '../../scripts/functions';
  import methods from '../methods';

  import MyImages from './MyImages.vue';
  import MyImageees from './MyImageees.vue';
  import MyAssets from './MyAssets.vue';
  import HomeGallery from './Home/HomeGallery/HomeGallery.vue';

  export default {
    name: 'my-profile',
    data: () => ({
      asset_packs: [],
      allAssetPaths: [],
      id_to_show: -1,
      metamask_account: 0,
      allAssets: [],
      my_images_on_chain: [],
      bought_assets: [],
      created_assets: [],
      myobjects: [],
    }),
    components: {
      HomeGallery,
      SliderGallery,
      'canvas-my-images': MyImages,
      'my-images-ipfs': MyImageees,
      'my-assets': MyAssets,
    },
    // computed: {
    // },
    methods: {
      async generateData() {
        await this.getImages();
        await this.getCreatedAssets();
        await this.getBoughtAssets();
        await this.getAllAssets();
        await this.getAssetPacks();
      },

      async getImages() {
        this.my_images_on_chain = await functions.getUserImages(this.metamask_account);
      },

      async getCreatedAssets() {
        this.created_assets = await functions.getAssetsUserCreated(this.metamask_account);
      },

      async getBoughtAssets() {
        this.bought_assets = await functions.getBoughtAssets(this.metamask_account);
        this.bought_assets = this.bought_assets.sort(function (a, b) {return a - b;});
      },

      async getAllAssets() {
        this.allAssets = await methods.loadDataForAssets();
      },

      async getAssetPacks() {
        this.asset_packs = await functions.getCreatedAssetPacks(this.metamask_account);
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
        let data = await functions.getImageMetadataFromContract(this.id_to_show);
        this.myobjects = await methods.getData(data[0], parseInt(data[1], 10), data[2], this.allAssets);
      },
    },

    async beforeMount() {
      web3.eth.getAccounts((err, acc) => {
        if (err) return console.error(err);
        this.metamask_account = acc[0];
        this.generateData();
      });
    }

  };

</script>

<style scoped lang="scss">
    .profile-page {
        background-color: #F9F9F9;

        .profile {
            position: relative;
            .thumbnail {
                position: absolute;
                top: -96px;
                width: 138px;
                height: 138px;
                background-color: #D4D4D4;
            }

            .description {
                display: flex;
                padding: 10px 0 32px 0;
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