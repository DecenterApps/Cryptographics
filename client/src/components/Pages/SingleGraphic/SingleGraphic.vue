<template>
    <div>
        <graphic-empty-state v-if="imageFailedToLoad" />
        <layout v-if="!imageFailedToLoad" layout-style="pulled-left">
            <div class="left">
                <graphic-preview
                        name="YoungSerif"
                        id="518"
                        :image="image"
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
                />
                <print-form @closePrintForm="orderPrint = false" v-else />
                <share-icons />
            </div>
            <div class="canvas-wrapper">
                <Canvas :canvasData="canvasData"></Canvas>
            </div>
        </layout>
    </div>
</template>

<script>
  import { METAMASK_ADDRESS, USERNAME } from 'store/user-config/types';
  import { CANVAS_DRAWING } from 'store/canvas/types';
  import { mapGetters } from 'vuex';
  import GraphicPreview from './GraphicPreview.vue';
  import GraphicEmptyState from './GraphicEmptyState.vue';
  import GraphicDetails from './GraphicDetails.vue';
  import PrintForm from './PrintForm.vue';
  import Canvas from '../CreateGraphic/GraphicBuilder/Canvas.vue';
  import {
    getAssetsOrigins,
    getImageMetadata,
    getUsername,
    getSelectedAssetPacksWithAssetData,
    isImageForSale,
    parseContractAssetData,
    getGalleryImage,
    getUserInfo,
  } from 'services/ethereumService';
  import ShareIcons from './ShareIcons';

  export default {
    name: 'SingleGraphic',

    data: () => ({
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
      },
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
        noBottomFrame: false,
      },
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
        userAddress: METAMASK_ADDRESS,
        isCanvasDrawing: CANVAS_DRAWING,
      })
    },
    methods: {
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
          link.click();
        }, 'image/jpeg');
      },
      async getData() {
        this.loggedIn = this.userAddress && (this.image.owner.toLowerCase() === this.userAddress.toLowerCase());
        this.forSale = await isImageForSale(this.$route.params.id);
      }
    },
    async created() {
      try {
        const metadata = await getImageMetadata(this.$route.params.id);
        const image = await getGalleryImage(this.$route.params.id, true);
        const creatorMeta = await getUserInfo(image.creator);
        this.image = {
          ...metadata,
          ...image,
          creatorMeta
        };
      } catch (err) {
        this.imageFailedToLoad = true;
        return;
      }

      this.getData();
      const packsUsed = await getAssetsOrigins(this.image.usedAssets) || [];
      this.assetPacksUsed = await getSelectedAssetPacksWithAssetData(packsUsed);
      const assetsForCanvas = await parseContractAssetData(this.image);
      console.log('assetsForCanvas', assetsForCanvas);
      this.canvasData = {
        frame: this.image.hasFrame,
        noBottomFrame: false,
        ratio: this.image.width === this.image.height ? '1:1' : '2:3',
        assets: assetsForCanvas,
        delay: 0,
      };
      this.canvasDataLoaded = true;
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
        max-width: 400px;
        min-width: 300px;
        padding-right: 50px;
    }

    .canvas-wrapper {
        display: none;
    }
</style>