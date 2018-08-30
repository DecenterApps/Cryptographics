<template>
    <layout layout-style="pulled-left">
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
                    :username="username"
                    :isLogged="loggedIn"
                    :isForSale="forSale"
                    :userAddress="userAddress"
                    @showPrintForm="orderPrint = true"
            />
            <print-form @closePrintForm="orderPrint = false" v-else />
            <share-icons />
        </div>
        <div class="canvas-wrapper">
            <Canvas :canvasData="canvasData"></Canvas>
        </div>
    </layout>
</template>

<script>
  import { METAMASK_ADDRESS, USERNAME } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import GraphicPreview from './GraphicPreview.vue';
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
        src: '',
      },
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
        noBottomFrame: false,
      }
    }),
    components: {
      ShareIcons,
      GraphicPreview,
      GraphicDetails,
      PrintForm,
      Canvas,
    },
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
      })
    },
    methods: {
      download() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        const title = this.image.title || 'cryptographic';
        link.setAttribute('download', title + '.jpeg');
        link.setAttribute('href', canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream'));
        link.click();
      }
    },
    async created() {
      this.image = await getImageMetadata(this.$route.params.id, true);
      const packsUsed = await getAssetsOrigins(this.image.usedAssets);
      this.assetPacksUsed = await getSelectedAssetPacksWithAssetData(packsUsed);
      this.username = await getUsername(this.image.creator);
      this.loggedIn = this.image.creator === this.userAddress;
      this.forSale = await isImageForSale(this.$route.params.id);
      const assetsForCanvas = await parseContractAssetData(this.image);
      console.log('assetsForCanvas', assetsForCanvas);
      this.canvasData = {
        frame: this.image.hasFrame,
        noBottomFrame: false,
        ratio: this.image.width === this.image.height ? '1:1' : '2:3',
        assets: assetsForCanvas,
        delay: 0,
      };
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