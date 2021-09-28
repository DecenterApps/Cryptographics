<template>
    <div>
        <layout layout-style="full-screen full-height" v-if="loading">
            <div class="loading-section">
                <loader />
                <h3>Please wait, we are loading the cryptographic from the blockchain and IPFS.</h3>
            </div>
        </layout>

        <graphic-empty-state v-if="!loading && imageFailedToLoad" />

        <layout v-if="!loading && !imageFailedToLoad" layout-style="full-screen full-height">
            <div class="left">
                <graphic-preview
                        name="YoungSerif"
                        id="518"
                        :image="image"
                        :canvasData="canvasData"
                        :isFake="isFake"
                        year="2018"
                        @download="download"
                />
            </div>
            <div class="right">
                <graphic-details
                        v-if="!orderPrint"
                        :image="image"
                        :assetPacks="assetPacksUsed"
                        :isLogged="loggedIn"
                        :isForSale="forSale"
                        :userAddress="userAddress"
                        @showPrintForm="orderPrint = true"
                        :getData="getData"
                        v-on:updateUI="getData"
                />
                <print-form @closePrintForm="orderPrint = false" v-else />
                <share-icons :image="image" v-if="!orderPrint" />
            </div>
        </layout>
    </div>
</template>

<script>
  import { ADDRESS, USERNAME, BANNED_CRYPTOGRAPHIC_IDS } from 'store/user-config/types';
  import { CANVAS_DRAWING } from 'store/canvas/types';
  import { mapGetters } from 'vuex';
  import * as ipfsService from 'services/ipfsService';
  import GraphicPreview from './GraphicPreview.vue';
  import GraphicEmptyState from './GraphicEmptyState.vue';
  import GraphicDetails from './GraphicDetails.vue';
  import PrintForm from './PrintForm.vue';
  import Canvas from '../CreateGraphic/GraphicBuilder/Canvas.vue';
  import {
    getAssetsOrigins,
    getImageMetadata,
    getImage,
    getSelectedAssetPacksWithAssetData,
    isImageForSale,
    getGalleryImage,
    getUserInfo,
  } from 'services/ethereumService';
  import ShareIcons from './ShareIcons';
  import { resizeCanvas } from '../../../services/helpers';
  import { parseTimestamp } from '../../../services/utils';

  export default {
    name: 'SingleGraphic',

    data: () => ({
      imageFailedToLoad: false,
      loading: false,
      orderPrint: false,
      loggedIn: false,
      forSale: false,
      assetPacksUsed: [],
      username: '',
      image: {
        creator: '',
        owner: '',
        username: '',
        src: '',
        id: '',
      },
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
        noBottomFrame: false,
      },
      isFake: false,
      canvasDataLoaded: false,
    }),
    components: {
      ShareIcons,
      GraphicPreview,
      GraphicDetails,
      PrintForm,
      Canvas,
      GraphicEmptyState,
    },
    computed: {
      ...mapGetters({
        userAddress: ADDRESS,
        isCanvasDrawing: CANVAS_DRAWING,
        bannedIDs: BANNED_CRYPTOGRAPHIC_IDS,
      }),
    },
    watch: {
      userAddress: {
        handler() {
          this.getData();
        }
      }
    },
    methods: {
      async checkFakeImage() {
        const canvas = document.getElementById('canvas');

        const UPLOAD_WIDTH = 307 * 2;
        const UPLOAD_HEIGHT = this.canvasData.ratio === '1:1' ? UPLOAD_WIDTH : 434 * 2;
        const canvasClone = resizeCanvas(canvas, UPLOAD_WIDTH, UPLOAD_HEIGHT);

        let image = canvasClone.toDataURL('image/png', 1);
        const hash = await ipfsService.getHash(image.substr(22));
        canvasClone.toBlob((blob) => {
          const link = document.createElement('a');
          const title = this.image.title || 'cryptographic';
          link.setAttribute('download', title + '.png');
          link.setAttribute('href', window.URL.createObjectURL(blob));
          link.click();
        }, 'image/png');
        // this.isFake = hash.toLowerCase() !== this.image.ipfsHash.toLowerCase();
      },
      checkAssetAmount() {
        const amountOfAssets = this.assetPacksUsed.reduce((amountOfAssets, assetPack) => amountOfAssets + assetPack.assets.length, 0);
        if (amountOfAssets >= 30 && this.image.potentialAssets.length < 30) {
          this.isFake = true;
        }
        console.log(amountOfAssets, this.image.potentialAssets.length);
      },
      async download() {
        const canvas = document.getElementById('canvas');
        while (!(this.canvasDataLoaded && !this.isCanvasDrawing)) {
          await new Promise((res) => setTimeout(res, 200));
          // Display notification if this is taking too long?
        }
        if (!canvas) return;
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          const title = this.image.title || 'cryptographic';
          link.setAttribute('download', title + '.jpeg');
          link.setAttribute('href', window.URL.createObjectURL(blob));
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 'image/jpeg');
      },
      async getData() {
        isImageForSale(this.$route.params.id)
          .then(isForSale => {
            this.forSale = isForSale;
          });
        try {
          const metadata = await getImageMetadata(this.$route.params.id);
          const image = await getGalleryImage(this.$route.params.id, true);
          const creatorMeta = await getUserInfo(image.creator);
          this.image = {
            ...metadata,
            ...image,
            creatorMeta,
            dateMinted: parseTimestamp(+metadata.timestamp),
            id: this.$route.params.id,
          };
        } catch (err) {
          this.imageFailedToLoad = true;
          return;
        }
        this.loggedIn = this.userAddress && (this.image.owner.toLowerCase() === this.userAddress.toLowerCase());
      },
    },
    async created() {
      if (this.bannedIDs.indexOf(parseInt(this.$route.params.id)) > -1) {
        this.$router.push('/');
      }
      this.loading = true;
      await this.getData();
      const packsUsed = await getAssetsOrigins(this.image.usedAssets) || [];
      const assetsForCanvas = await getImage(this.image.randomSeed, null, this.image.potentialAssets, this.image.finalSeed);
      this.loading = false;
      this.canvasData = {
        frame: this.image.hasFrame,
        finalFrameData: this.image,
        ratio: this.image.width === this.image.height ? '1:1' : '2:3',
        assets: assetsForCanvas,
        delay: 0,
      };
      this.assetPacksUsed = await getSelectedAssetPacksWithAssetData(packsUsed);
      this.canvasDataLoaded = true;
      this.checkAssetAmount();
      console.log(this.image);
      document.title = this.image.title + ' - cryptographic  | Cryptographics';
    }
  };
</script>

<style scoped lang="scss">
    .left {
        display: flex;
        align-items: center;
        max-width: none !important;
    }

    .right {
        position: relative;
        /*max-width: 400px;*/
        min-width: 300px;
        padding-right: 50px;
    }

    .canvas-wrapper {
        display: none;
    }

    .loading-section {
        height: 100%;
        width: 1120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*background-color: #CECECE;*/
        margin-top: 30px;
        text-align: center;
        padding: 10px;
        & .loader-content {
            margin-bottom: 20px;
        }
    }
</style>
