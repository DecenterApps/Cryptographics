<template>
    <div class="graphic-builder">
        <div class="left">
            <div class="canvas-with-overlay-wrapper" @click="(currentStep === 1) ? (renderCanvas() && track('Recompose')): (download())">
                <overlay v-if="currentStep === 2" key="1">
                    <button-icon icon-type="download" />
                    <p>Download</p>
                </overlay>
                <overlay v-if="currentStep === 1" key="2">
                    <button-icon icon-type="recompose" />
                    <p>Recompose</p>
                </overlay>
                <Canvas :canvasData="canvasData"></Canvas>
            </div>
        </div>
        <!-- FIRST SCREEN OF GRAPHIC BUILDER FLOW  -->
        <div v-if="currentStep === 1" class="right">
            <div class="selected-asset-packs">
                <h1 class="small-title">
                    Selected asset packs
                </h1>
                <div class="pack-list">
                    <asset-box
                      v-for="(assetPack, index) in selectedAssetPacks"
                      :key="index"
                      :assetPack="assetPack"
                      :small="true"
                      color="#eee"
                      action="close"
                      @click="toggleAsset(assetPack)"
                    />
                    <div @click="changeStep(0)" class="add-more">
                        +
                    </div>
                </div>

                <div class="help">
                    <p>Use the + button above to add more asset packs or change your selection. Click the asset pack and remove it from selection.</p>
                    <p>Once you compose a unique variation that you like, simply click Next to save it and claim ownership.</p>
                </div>
            </div>

            <div class="controls">
                <div class="top-controls">
                    <cg-checkbox v-on:checked="(val) => { canvasData.frame = val; track('Toggle frame') }">Add white frame</cg-checkbox>
                    <cg-checkbox v-on:checked="toggleRatio(); track('Toggle format')" :disabled="isCanvasDrawing">Use square format</cg-checkbox>
                    <cg-button
                            :loading="isCanvasDrawing || gettingImageData"
                            @click="renderCanvas(); track('Recompose')"
                            :disabled="selectedAssetPacks.length === 0"
                            button-style="secondary">
                        Recompose
                    </cg-button>
                </div>
                <separator></separator>
                <div class="bottom-controls">
                    <!--<cg-button @click="buyImage">Submit</cg-button>-->
                    <price size="medium" :value="displayPrice()" />
                    <cg-button
                            :loading="isCanvasDrawing"
                            @click="changeStep(2)"
                            :disabled="selectedAssetPacks.length === 0"
                    >
                        Next
                    </cg-button>
                </div>
            </div>
        </div>
        <!-- END OF FIRST SCREEN OF GRAPHIC BUILDER FLOW  -->

        <!-- SECOND SCREEN OF GRAPHIC BUILDER FLOW  -->
        <div v-if="currentStep === 2" class="right">
            <div class="selected-asset-packs">
                <div class="final-pack-list">
                    <div class="final-pack-item" v-for="(assetPack, index) in selectedAssetPacks" :key="index">
                        <asset-box
                                :key="index"
                                :assetPack="assetPack"
                                :small="true"
                                color="#eee"
                        />
                        <div class="asset-pack-meta">
                            <h1 class="small-title">{{ assetPack.packName }}</h1>
                            <div :class="['small-title', customPrice(assetPack)]">{{ customPrice(assetPack) }}</div>
                        </div>
                    </div>
                </div>

                <div class="help">
                    <p>This is your cryptographic.</p>
                    <p>You can simply click it and download an image file to your device.</p>
                    <p>
                        However, in order to save it permanently on the blockchain and obtain true ownership, you
                        need to claim the cryptographic.
                    </p>
                    <p>
                        Claiming a cryptographic also means that the artists whose asset packs you used receive a
                        payment for them, after which you can use them for any number of cryptographics in the future.
                    </p>
                </div>
            </div>


            <div class="controls">
                <div class="top-controls buy-screen">
                    <div class="small-title">Title</div>
                    <cg-input
                            :inputStyle="errors.length > 0 ? 'input error' : 'input'"
                            v-on:input="checkTitle"
                            v-model="title"
                            :max-length="20"
                    />
                    <div class="small-title">Description</div>
                    <cg-textarea
                            :inputStyle="errors.length > 0 ? 'input error' : 'input'"
                            v-model="description"
                            :max-length="600"
                    />
                </div>
                <separator></separator>
                <div class="bottom-controls buy-screen">
                    <div>
                        <cg-button
                                @click="changeStep(1)"
                                button-style="secondary"
                        >
                            Back
                        </cg-button>
                    </div>
                    <div class="separate-controls">
                        <price size="medium" :value="displayPrice()" />
                        <cg-button
                                :loading="isCanvasDrawing"
                                @click="buyImage(); track('Claim')"
                        >
                            Claim cryptographic
                        </cg-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END OF SECOND SCREEN OF GRAPHIC BUILDER FLOW  -->
    </div>
</template>

<script>
  import {
    pickTenRandoms,
    calculatePrice,
    calculateFirstSeed,
    convertSeed,
    getImage,
  } from 'services/ethereumService';
  import Canvas from './Canvas.vue';
  import * as utils from 'services/utils';
  import * as imageService from 'services/imageService';
  import * as ipfsService from 'services/ipfsService';
  import { resizeCanvas, shuffleArray, uniq } from 'services/helpers';
  import { mapActions, mapGetters } from 'vuex';
  import { METAMASK_ADDRESS, USERNAME, BOUGHT_ASSETS_PACKS_IDS } from 'store/user-config/types';
  import {
    TOGGLE_MODAL,
    SHOW_LOADING_MODAL,
    TOGGLE_LOADING_MODAL,
    CHANGE_LOADING_CONTENT,
    HIDE_LOADING_MODAL,
  } from 'store/modal/types';
  import { CANVAS_DRAWING, SELECTED_ASSET_PACKS, TOGGLE_ASSET_PACK } from 'store/canvas/types';

  export default {
    name: 'GraphicBuilder',
    components: {
      Canvas
    },
    props: {
      currentStep: {
        default: 0,
      }
    },
    data: () => ({
      title: '',
      description: '',
      errors: [],
      buyScreen: false,
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
        noBottomFrame: false,
      },
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
      imagePrice: null,
      potentialAssets: [],
      selectedAssets: [],
      claimPressed: false,
      gettingImageData: false,
    }),
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
        username: USERNAME,
        isCanvasDrawing: CANVAS_DRAWING,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS,
        selectedAssetPacks: SELECTED_ASSET_PACKS,
      })
    },
    watch: {
      selectedAssetPacks: async function () {
        this.selectedAssets = this.selectedAssetPacks.map(assetPack =>
          assetPack.assets.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);
        this.iterations = 0;
        this.timestamp = new Date().getTime();
        this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(this.randomSeed);
      },
      username: function (val) {
        if (val !== '' && val !== 'Anon' && this.claimPressed) {
          this.buyImage();
        }
      }
    },
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL,
        toggleLoadingModal: TOGGLE_LOADING_MODAL,
        toggleAsset: TOGGLE_ASSET_PACK,
        openLoadingModal: SHOW_LOADING_MODAL,
        closeLoadingModal: HIDE_LOADING_MODAL,
        changeLoadingContent: CHANGE_LOADING_CONTENT,
      }),
      customPrice(assetPack) {
        if (this.userAddress === assetPack.creator) {
          return 'created';
        }
        if (this.boughtPacksIDs.indexOf(assetPack.id.toString()) >= 0) {
          return 'bought';
        }

        return `Ξ ${assetPack.price}`;
      },

      checkTitle() {
        this.errors = [];

        if (this.title) {
          return true;
        }

        if (this.title === '' || this.title.length > 20) {
          this.errors.push('Title required.');
        }
      },

      async buyImage() {
        if (!this.checkTitle()) return;
        if (!this.userAddress) {
            const { userAgent: ua } = navigator;
            const { currentProvider: cp } = window.web3;
            const isHttpProvider = window.web3.currentProvider.constructor.name === 'HttpProvider';
            const isMobile = ua.includes('Android', 'iPad', 'iPhone');
            if (isMobile && isHttpProvider) return this.openModal('coinbaseInfo');
            if (!isMobile && isHttpProvider) return this.openModal('metaMaskInfo');
        }

        console.log(this.username);
        if (this.username === '' || this.username === 'Anon') {
          this.claimPressed = true;
          return this.openModal('setUsername');
        }

        try {
          const UPLOAD_WIDTH = 307 * 2;
          const UPLOAD_HEIGHT = this.canvasData.ratio === '1:1' ? UPLOAD_WIDTH : 434 * 2;
          console.log(UPLOAD_WIDTH, UPLOAD_HEIGHT);
          let canvas = Canvas.methods.getCanvasElement();
          const canvasClone = resizeCanvas(canvas, UPLOAD_WIDTH, UPLOAD_HEIGHT);

          this.openLoadingModal('Uploading your graphic to IPFS...');
          let image = canvasClone.toDataURL('image/png', 1);
          let ipfsHash = await ipfsService.uploadFile(image.substr(22));
          console.log('IMAGE HASH ' + ipfsHash);
          console.log(this.potentialAssets);
          let imageMetadata = {
            title: this.title,
            description: this.description,
            frame: this.canvasData.frame ? 1 : 0,
            width: 2480,
            height: (this.canvasData.ratio === '2:3' ? 3508 : 2480),
          };
          let extraData = await ipfsService.uploadJSON(JSON.stringify(imageMetadata));
          console.log(extraData);

          this.openLoadingModal('Please confirm the transaction in MetaMask.');
          let transactionPromise = await imageService.createImage(
            this.randomHashIds,
            this.timestamp,
            this.iterations,
            this.potentialAssets,
            this.username,
            this.userAddress,
            this.imagePrice,
            ipfsHash,
            extraData,
          );
          this.changeLoadingContent('Please wait while the transaction is written to the blockchain. You will receive your cryptographic\'s token shortly.');
          const result = await transactionPromise();
          const id = result.events.ImageCreated.returnValues.imageId;
          this.closeLoadingModal();
          this.$router.push(`cryptographic/${id}`);
          this.openModal('Cryptographic successfully saved to the blockchain forever.');
        } catch (e) {
          const message = 'Error: ' + e.message.replace('Returned error: ', '').replace(/Error: /g, '');
          this.openLoadingModal(message, true);
        }
      },
      async renderCanvas() {
        this.gettingImageData = true;
        try {
          this.iterations++;
          console.log(this.selectedAssets);
          let selectedAssets = this.selectedAssets;

          // Don't shuffle if user came from home page
          console.log(window.sessionStorage.length);
          if (window.sessionStorage.length <= 0) {
            selectedAssets = shuffleArray(selectedAssets);
          }
          selectedAssets = selectedAssets.slice(0, 30);
          this.canvasData.assets = await getImage(this.randomSeed, this.iterations, selectedAssets);
          console.log('iteration: ' + this.iterations);
          this.potentialAssets = selectedAssets;
          let picked = [];

          for (let i = 0; i < this.canvasData.assets.length; i++) {
            picked.push(this.canvasData.assets[i].id);
          }

          let price = await calculatePrice(picked, this.userAddress);

          if (selectedAssets.length === 0) {
            this.imagePrice = 0;
          }

          this.imagePrice = utils.scientificToDecimal(parseFloat(price));
          
          console.log('PRICE : ' + this.imagePrice);
        } catch (e) {
          this.gettingImageData = false;
        }
        this.gettingImageData = false;
      },
      download() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          const title = this.title || 'cryptographic';
          link.setAttribute('download', title + '.jpeg');
          link.setAttribute('href', window.URL.createObjectURL(blob));
          link.click();
        }, 'image/jpeg');
        this.track('Download');
      },
      changeStep(step) {
        window.scrollTo(0, 0);
        this.$emit('stepChange', step);
      },
      toggleRatio(square) {
        this.canvasData.ratio = square ? '1:1' : '2:3';
      },
      displayPrice() {
        if (isNaN(this.imagePrice) || this.imagePrice === null) return null;
        return web3.utils.fromWei(this.imagePrice.toString(), 'ether');
      },
      track(event) {
        if (window._paq) window._paq.push(['trackEvent', 'Composer', event]);
      },
    },
    async created() {
      this.selectedAssets = this.selectedAssetPacks.map(assetPack =>
        assetPack.assets.map(asset => parseInt(asset.id)))
        .reduce((a, b) => a.concat(b), []);
      if (window.sessionStorage.length > 0) {
        const landingPageAssets = JSON.parse(sessionStorage.getItem('potentialAssets'));
        this.selectedAssets = [...landingPageAssets];
        // this.canvasData.ratio = '1:1';2
        this.randomHashIds = JSON.parse(sessionStorage.getItem('randomHashIds'));
        this.timestamp = sessionStorage.getItem('timestamp');
        this.iterations = parseInt(sessionStorage.getItem('iterations'), 10);
        const firstSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(firstSeed);
        console.log('Random hash ids: ' + this.randomHashIds);
        console.log('Random seed ' + this.randomSeed);
        console.log('Iterations: ' + this.iterations);
        console.log('Timestamp : ' + this.timestamp);
        await this.renderCanvas();
        window.sessionStorage.clear();
      } else {
        this.randomHashIds = pickTenRandoms();
        this.iterations = 0;
        this.timestamp = new Date().getTime();
        this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(this.randomSeed);
        this.renderCanvas();
      }
    },
  };
</script>

<style scoped lang="scss">
    .graphic-builder {
        position: relative;
        display: flex;
        width: 100%;

        .left {
            flex-shrink: 1;
            .canvas-with-overlay-wrapper {
                position: relative;
                p {
                    font-size: 16px;
                    margin: 10px 0;
                }
                .overlay {
                    transition: opacity .2s;
                    animation: fade-out 1s;
                    @keyframes fade-out {
                        0% { opacity: 1; }
                        60% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                }
                @media screen and (min-width: 768px) {
                    &:hover {
                        .overlay {
                            opacity: 1;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .right {
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            flex-grow: 1;
            margin-left: 50px;
            /*max-width: 400px;*/
            min-width: 300px;
            width: 100%;
        }
        @media screen and (max-width: 767px) {
            flex-direction: column;
            .left {
                margin-bottom: 30px;
                flex-grow: 1;
                width: 100%;
                display: flex;
                .canvas-wrapper {
                    flex: 1 0 100%;
                }
            }
            .right {
                margin: 0;
                flex-direction: column;
                align-items: stretch;
                max-width: none;
                .controls {
                    margin: 30px 0;
                    align-items: flex-start;
                    .asset-controls {
                        flex-direction: row;
                        align-items: center;
                        margin-bottom: 30px;
                        .selected-asset-packs {
                            margin-left: 30px;
                            .asset {
                                margin-top: 0;
                            }
                        }
                    }
                }
            }
        }
    }

    .selected-asset-packs {
        max-width: 510px;

        .final-pack-list {
            display: flex;
            flex-direction: column;
            /*justify-content: flex-end;*/
            /*align-items: flex-end;*/
            max-height: 300px;
            overflow-y: auto;

            .final-pack-item {
                display: flex;
                margin-bottom: 20px;
                min-height: 55px;

                .asset-pack-meta {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    margin-left: 15px;

                    .small-title {
                        margin-bottom: 10px;

                        &.bought, &.creator {
                            font-size: 16px;
                            color: #949494;
                        }

                        &:last-child {
                            margin: 0;
                        }
                    }
                }
            }
        }

        .pack-list {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
            .asset-box {
                margin-right: 18px;
                margin-bottom: 20px;
                &:nth-child(5n) {
                    margin-right: 0;
                }
            }
            .add-more {
                height: 56px;
                width: 75px;
                margin-top: 4px;
                border: 1px solid #949494;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: #949494;
                cursor: pointer;

                &:hover {
                    color: #000;
                    border: 1px solid #000;
                }
            }
        }

        .small-title {
            margin-bottom: 10px;
        }
    }

    .help {
        padding: 10px 20px;
        background-color: #e2e2e2;
        p {
            /*max-width: 400px;*/
            color: #333;
            font-size: 14px;
            line-height: 1.5em;
            font-weight: 300;
            margin: 10px 0;
        }
    }

    .formats {
        font-size: 10px;
        color: #7c7c7c;
        display: flex;
        margin: 20px 0;
        justify-content: flex-end;
        .format {
            cursor: pointer;
            text-align: right;
            margin-right: 20px;
            &:first-of-type {
                .box {
                    width: 38px;
                    height: 38px;
                }
            }
            &:last-of-type {
                margin-right: 0;
                .box {
                    width: 28px;
                    height: 38px;
                }
            }
            .box {
                background-color: #fff;
                margin-bottom: 5px;
                &.selected {
                    background-color: #000;
                }
            }
        }
    }

    .controls {
        .asset-controls {
            margin-bottom: 100px;
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .top-controls {
            margin-bottom: 20px;

            button {
                margin-top: 10px;
            }

            .small-title {
                margin-bottom: 15px;
                margin-top: 10px;
            }

            &.buy-screen {
                /*display: flex;*/
                /*flex-direction: column;*/
                /*align-items: flex-end;*/
                margin-bottom: 0;

                input {
                    width: 185px;
                    margin-top: 20px;
                }
            }
        }
        .bottom-controls {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-top: 20px;

            span {
                margin-right: 17px;
            }

            button {
                min-width: 70px;
            }

            .price {
                max-width: 85px;
            }

            &.buy-screen {
                justify-content: space-between;

                .separate-controls {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;

                    button {
                        min-width: 135px;
                    }
                }
            }

            .large-title {
                margin: 0 15px 0 0;
            }
        }
    }
</style>