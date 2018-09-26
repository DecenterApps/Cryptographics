<template>
    <!-- FIRST STEP -->
    <div class="create-asset-pack">
        <step-header
                :currentStep="currentStep"
                :steps="['Upload Assets', 'Test Asset Pack', 'Submit Asset Pack']"
                v-on:stepChange="changeStep"
        />
        <div class="page-wrapper" v-show="currentStep === 0">
            <layout layout-style="full-screen">
                <div class="left first-screen">
                    <div class="top-content">
                        <h1 class="large-title">Select assets</h1>
                        <input-file
                                id="files"
                                button-style="secondary"
                                @change="uploadAssets">
                            <span>Upload multiple assets</span>
                            <span v-if="assets.length > 0">Assets in pack {{ assets.length }} of {{ maxAssets }}</span>
                        </input-file>
                        <upload-description v-if="assets.length > 0" />
                    </div>
                </div>
                <div class="right">
                    <upload-description v-if="assets.length === 0" />
                    <div v-bar="{ preventParentScroll: true }">
                        <div>
                            <single-asset
                                    v-for="(asset, index) in assets"
                                    :remove="remove.bind(this, index)"
                                    :index="index"
                                    :toggleAttribute="toggleAttribute.bind(this)"
                                    :asset="asset"
                                    :key="index"
                            ></single-asset>
                        </div>
                    </div>
                </div>
            </layout>
            <div class="container">
                <separator></separator>
                <div class="bottom-content">
                    <cg-button @click="changeStep(1)">
                        Next
                    </cg-button>
                </div>
            </div>
        </div>
        <div class="page-wrapper" v-if="currentStep === 1">
            <layout layout-style="full-screen">
                <test-asset-pack
                        :selected-assets="assets"
                        :changeStep="changeStep"
                ></test-asset-pack>
            </layout>
        </div>
        <div class="page-wrapper" v-show="currentStep === 2">
            <layout layout-style="full-screen">
                <div class="left-content">
                    <h1 class="large-title">Submit asset pack</h1>
                    <div class="graphic-preview">
                        <canvas id="thumbnail-canvas"></canvas>
                    </div>
                    <div class="button-group submit">
                        <cg-button button-style="secondary" @click="renderCanvas">
                            Generate thumbnail
                        </cg-button>
                    </div>
                </div>

                <div class="right-content">
                    <div class="input-content">
                        <div class="inputs-wrapper">
                            <div class="input-group">
                                <label class="small-title">Asset pack name</label>
                                <cg-input
                                        v-on:input="checkErrors('name')"
                                        :inputStyle="errors.name ? 'input error' : 'input'"
                                        v-model="name"
                                        :max-length="20"
                                        name="packName"
                                />
                            </div>
                            <div class="input-group">
                                <label class="small-title">Asset pack price</label>
                                <cg-input
                                        v-on:input="checkErrors('price')"
                                        :inputStyle="errors.price ? 'input error' : 'input'"
                                        v-model="price"
                                        inputType="number"
                                        name="price"
                                        placeholder="Value"
                                />
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="small-title">Description</label>
                            <cg-textarea v-model="description" placeholder="Describe your asset pack"></cg-textarea>
                        </div>
                    </div>
                </div>
            </layout>
            <div class="container">
                <separator></separator>
                <div class="submit-button">
                    <cg-button
                            @click="uploadToIpfs">
                        Submit
                    </cg-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import * as ipfsService from 'services/ipfsService';
  import { createAssetPack, makeCoverImage } from 'services/imageService';
  import * as utils from 'services/utils';
  import { METAMASK_ADDRESS } from 'store/user-config/types';
  import { mapGetters, mapActions } from 'vuex';
  import { TOGGLE_MODAL, TOGGLE_LOADING_MODAL, CHANGE_LOADING_CONTENT, HIDE_LOADING_MODAL } from 'store/modal/types';

  import StepHeader from 'shared/StepHeader/StepHeader';
  import { preloadImages, resizeCanvas } from 'services/helpers';
  import SingleAsset from './SingleAsset/SingleAsset';
  import UploadDescription from './UploadDescription/UploadDescription';
  import TestAssetPack from './TestAssetPack/TestAssetPack';

  export default {
    name: 'CreateAssetPack',
    components: {
      TestAssetPack,
      UploadDescription,
      SingleAsset,
      StepHeader
    },
    data: () => ({
      steps: [],
      currentStep: 0,
      name: '',
      description: '',
      price: '',
      stage: 'select',
      maxAssets: 50,
      assets: [],
      errors: {
        name: false,
        price: false,
      },
      canvasData: {
        assets: [],
        ratio: '1:1',
        frame: false,
      },
    }),

    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
      })
    },

    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL,
        toggleLoadingModal: TOGGLE_LOADING_MODAL,
        closeLoadingModal: HIDE_LOADING_MODAL,
        changeLoadingContent: CHANGE_LOADING_CONTENT,
      }),
      changeStep(step) {
        console.log(step);
        if (step === 2) this.renderCanvas();
        this.currentStep = step;
      },
      uploadAssets() {
        let x = document.getElementById('files');
        for (let i = 0; i < x.files.length; i++) {
          const file = x.files[i];

          if (file.size <= 2500000) {
            const img = new Image();
            const path = URL.createObjectURL(file);
            img.src = path;

            img.onload = () => {
              const width = img.naturalWidth;
              const height = img.naturalHeight;

              if (this.assets.length >= 50) return;
              if (width > 2480 || height > 3508) return;

              this.assets.push({
                path,
                file: x.files[i],
                attribute: 211,
              });
            };
          }
        }
      },

      renderCanvas() {
        let canvas = document.getElementById('thumbnail-canvas');
        canvas.width = 2480;
        canvas.height = 1805;
        makeCoverImage(false, this.assets, canvas, canvas.width, canvas.height);
      },
      checkErrors(toCheck = '') {
        const checkAll = !toCheck;

        if (toCheck === 'name' || checkAll) this.errors.name = !this.name || this.name.length > 20;
        if (toCheck === 'price' || checkAll) this.errors.price = !this.price || this.price === 0

        return Object.keys(this.errors).filter(key => this.errors[key]).length > 0;
      },
      async uploadToIpfs() {
        if (this.checkErrors()) return;
        if (!this.userAddress) return this.openModal('metaMaskInfo');

        let hashes = [];
        let canvas = document.getElementById('thumbnail-canvas');

        const UPLOAD_WIDTH = 386 * 2;
        const UPLOAD_HEIGHT = 281 * 2;
        const canvasClone = resizeCanvas(canvas, UPLOAD_WIDTH, UPLOAD_HEIGHT);

        let coverImage = canvasClone.toDataURL('image/png');
        let coverHash = await ipfsService.uploadFile(coverImage.substr(22));
        let metadata = {
          name: this.name,
          description: this.description,
        };
        let metadataIpfsHash = await ipfsService.uploadJSON(JSON.stringify(metadata));
        console.log(metadataIpfsHash);
        const price = this.price;
        const images = [];
        for (let i = 0; i < this.assets.length; i++) {
          const file = {
            image: new FileReader(),
          };
          file.image.readAsDataURL(this.assets[i].file);
          images.push(file);
        }

        console.log('started');
        preloadImages(images)
          .done(async (loadedImages) => {
            console.log(loadedImages, images);
            for (let i = 0; i < this.assets.length; i++) {
              let ipfsHash = await ipfsService.uploadFile(loadedImages[i].image.result.substr(22));
              hashes.push(utils.getBytes32FromIpfsHash(ipfsHash));
              if (i === this.assets.length - 1) {
                console.log(hashes);
                console.log(price);
                const attributes = this.assets.map(item => item.attribute);
                console.log(attributes);
                this.toggleLoadingModal('Please confirm the transaction in MetaMask.');
                const transactionPromise = await createAssetPack(
                  utils.getBytes32FromIpfsHash(coverHash),
                  attributes,
                  hashes,
                  price,
                  this.userAddress,
                  metadataIpfsHash,
                );
                this.changeLoadingContent('Please wait while the transaction is written to the blockchain. Your asset pack will be listed shortly.');
                const result = await transactionPromise();
                const id = result.events.AssetPackCreated.returnValues.id;
                this.closeLoadingModal();
                this.$router.push(`/asset-pack/${id}`);
                this.openModal('Asset pack successfully saved to the blockchain forever.');
                console.log(result, id);
              }
            }
          });
      },
      remove(index) {
        this.assets.splice(index, 1);
      },

      toggleAttribute(index, attributeType) {
        const attribute = this.assets[index].attribute;
        const digit = Math.floor((attribute / (10 ** attributeType)) % 10);
        if (digit === 1) {
          return this.assets[index].attribute += 10 ** attributeType;
        }
        this.assets[index].attribute -= 10 ** attributeType;
      }
    },

  };
</script>

<style scoped lang="scss">
    .create-asset-pack {
        min-height: 100vh;
        .page-wrapper {
            min-height: calc(100vh - 66px);
            background-color: #D9D9D9;
        }
    }

    .content-wrapper {
        .container {
            padding-top: 81px;
        }
    }

    .line-separator {
        margin-top: 35px;
        margin-bottom: 20px;
    }

    .bottom-content {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .left, .left-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between !important;

        &.first-screen {
            max-height: 432px;
            min-width: 300px;
            max-width: 400px;
        }

        &.submit {
            max-width: 400px;
        }
        .input-file {
            margin-bottom: 30px;
        }
        .button-group {
            display: inline-flex;

            &.submit {
                justify-content: space-between;
            }
            button {
                margin: 0 5px;
                width: 155px;
                &:first-of-type {
                    margin-left: 0;
                }
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
        .graphic-preview {
            display: inline-flex;
            align-items: flex-end;
            margin-bottom: 20px;
            canvas {
                background-color: white;
                width: 386px;
                height: 281px;
            }
            button {
                margin-left: 10px;
            }
        }
    }

    .left-content {
        justify-content: normal !important;
    }

    .right-content {
        flex: 1;
        padding: 0 80px 0 20px;

        .input-content {
            height: 281px;
            margin-bottom: 20px;
        }

        textarea {
            width: 100%;
            height: 155px;
        }

        p {
            max-width: 240px;
            line-height: 19px;
        }

        .inputs-wrapper {
            display: flex;
            margin-top: 62px;

        }

        .input-group {
            flex-direction: column;
            min-width: 180px;

            &:first-child {
                margin-right: 20px;
            }

            .small-title {
                display: inline-block;
                margin-bottom: 20px;
            }
            .input-wrapper {
                margin-bottom: 20px;
            }
        }
    }

    .right {
        justify-content: flex-end;

        & > div {
            width: 100% !important;
            max-width: 688px !important;
            max-height: 432px !important;
            overflow: hidden !important;
        }
    }

    .submit-button {
        display: flex;
        justify-content: flex-end;
    }

    .pack-name {
        width: 210px;
        margin-right: 20px;
    }

    .pack-price {
        width: 92px;
    }
</style>