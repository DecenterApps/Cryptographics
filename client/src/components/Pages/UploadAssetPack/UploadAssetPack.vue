<template>
    <!-- FIRST STEP -->
    <div>
        <layout layout-style="pulled-left" v-show="stage === 'select'">
            <div class="left first-screen">
                <div class="top-content">
                    <h1 class="large-title">Select assets</h1>
                    <input-file
                            id="files"
                            button-style="transparent"
                            @change="uploadAssets">
                        <span>Upload multiple assets</span>
                        <span>Assets in pack {{ assets.length }} of {{ maxAssets }}</span>
                    </input-file>
                </div>
                <div class="bottom-content">
                    <div class="button-group">
                        <cg-button
                                button-style="transparent"
                        >
                            Try
                        </cg-button>
                        <cg-button
                                @click="stage = 'submit'"
                        >
                            Next
                        </cg-button>
                    </div>
                </div>
            </div>
            <div class="right">
                <div v-bar="{ preventParentScroll: true }">
                    <div>
                        <div
                                class="asset"
                                v-for="(asset, index) in assets"
                                :key="index">
                            <div v-if="isBackground(asset)" class="preview-icons">
                                <ico-background @click.native="toggleBackground(index)" />
                            </div>
                            <img :src="asset.path" />
                            <overlay>
                                <div class="span ico-background">
                                    <ico-background
                                            :ico-color="isBackground(asset) ? '#fff' : '#636363'"
                                            ico-stroke="none"
                                            @click.native="toggleBackground(index)"
                                    />
                                </div>
                                <ico-trash @click.native="remove(index)" />
                            </overlay>
                        </div>
                    </div>
                </div>
            </div>
        </layout>
        <layout layout-style="pulled-left" v-show="stage === 'submit'">
            <div class="left-content">
                <h1 class="large-title">Submit asset pack</h1>
                <div class="graphic-preview">
                    <canvas id="canvas"></canvas>
                </div>
                <div class="button-group submit">
                    <cg-button
                            @click="stage = 'select'"
                            button-style="transparent"
                    >
                        Back
                    </cg-button>
                    <cg-button
                            button-style="transparent"
                            @click="renderCanvas"
                    >
                        Generate
                    </cg-button>
                </div>
            </div>

            <div class="right-content">
                <div class="input-content">
                    <div class="input-group">
                        <label class="small-title">Asset pack name</label>
                        <cg-input name="pack_name" placeholder="0 / 20" />
                        <label class="small-title">Asset pack price</label>
                        <cg-input name="price" placeholder="Value" />
                    </div>
                    <p>Each asset pack can contain up to 50 different graphic elements, one of which always needs to be
                        a
                        background graphic.</p>
                </div>
                <div class="submit-button">
                    <cg-button
                            @click="uploadToIpfs">
                        Submit
                    </cg-button>
                </div>
            </div>
        </layout>
    </div>
</template>

<script>
  import * as ipfsService from 'services/ipfsService';
  import { createAssetPack, makeCoverImage } from 'services/imageService';
  import * as utils from 'services/utils';
  import { METAMASK_ADDRESS } from 'store/user-config/types';
  import { mapGetters } from 'vuex';

  import IcoTrash from './template/IcoTrash.vue';
  import IcoBackground from './template/IcoBackground.vue';
  import { preloadImages, resizeCanvas } from 'services/helpers';

  export default {
    name: 'UploadAssetPack',
    components: {
      IcoTrash,
      IcoBackground
    },
    data: () => ({
      stage: 'select',
      maxAssets: 50,
      assets: [],
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

    watch: {
      stage: function (val) {
        if (val === 'submit') {
          this.renderCanvas();
        }
      }
    },

    methods: {
      isBackground(asset) {
        return asset.attribute.toString().slice(0, 1) === '1';
      },
      uploadAssets() {
        let x = document.getElementById('files');
        for (let i = 0; i < x.files.length; i++) {
          this.assets.push({
            path: URL.createObjectURL(x.files[i]),
            file: x.files[i],
            attribute: 222,
          });
        }
      },

      renderCanvas() {
        let canvas = document.getElementById('canvas');
        canvas.width = 2480;
        canvas.height = 1805;
        console.log(this.assets);
        makeCoverImage(false, this.assets, canvas, canvas.width, canvas.height);
      },
      async uploadToIpfs() {
        let hashes = [];
        let canvas = document.getElementById('canvas');

        const UPLOAD_WIDTH = 386 * 2;
        const UPLOAD_HEIGHT = 281 * 2;
        const canvasClone = resizeCanvas(canvas, UPLOAD_WIDTH, UPLOAD_HEIGHT);

        let coverImage = canvasClone.toDataURL('image/png');
        let coverHash = await ipfsService.uploadFile(coverImage.substr(22));
        const price = document.querySelector('input[name=price]').value;
        const name = document.querySelector('input[name=pack_name').value;
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
                await createAssetPack(utils.getBytes32FromIpfsHash(coverHash), name, attributes, hashes, price, this.userAddress);
              }
            }
          });
      },
      remove(index) {
        this.assets.splice(index, 1);
        let assets = this.assets;
        let canvas = document.getElementById('canvas');
        canvas.width = 386;
        canvas.height = 281;
        let asset_paths = [];
        for (let i = 0; i < this.assets.length; i++) {
          asset_paths.push(this.assets[i].path);
        }
        makeCoverImage(false, asset_paths, canvas, 500, 365);
      },

      toggleBackground(index) {
        console.log(index);
        if (this.assets[index].attribute === 122) {
          return this.assets[index].attribute = 222;
        }
        this.assets[index].attribute = 100 + this.assets[index].attribute % 100;
      }
    },

  };
</script>

<style scoped lang="scss">
    .content-wrapper {
        .container {
            padding-top: 81px;
        }
    }

    .left, .left-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between !important;

        &.first-screen {
            max-height: 432px;
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
            .button-wrapper {
                margin: 0 5px;
                &:first-of-type {
                    margin-left: 0;
                }
                &:last-of-type {
                    margin-left: 15px;
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
            .button-wrapper {
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

        p {
            max-width: 240px;
            line-height: 19px;
        }

        .submit-button {
            display: flex;
            justify-content: flex-end;
        }

        .input-group {
            width: 100%;
            flex-direction: column;
            margin-top: 62px;
            .small-title {
                display: inline-block;
                margin-bottom: 20px;
            }
            .input {
                margin-bottom: 20px;

                &:first-of-type {
                    width: 185px;
                }

                &:last-of-type {
                    width: 85px;
                }
            }
        }
    }

    .right {
        & > div {
            width: 100% !important;
            max-width: 688px !important;
            max-height: 432px !important;
            overflow: hidden !important;
        }
    }

    .pack-name {
        width: 210px;
        margin-right: 20px;
    }

    .pack-price {
        width: 92px;
    }

    .asset {
        position: relative;
        background: #ECECEC;
        margin-bottom: 20px;
        width: 206px;
        height: 206px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 10px;
        img {
            max-width: 100%;
            max-height: 100%;
        }
        &:nth-child(3n + 2) {
            margin: 0 20px;
        }
        &:nth-last-child(-n+3) {
            margin-bottom: 0;
        }

        .ico-trash {
            position: absolute;
            top: 15px;
            right: 15px;
        }

        .ico-background {
            position: absolute;
            bottom: 15px;
            left: 15px;
        }

        svg {
            cursor: pointer;
            fill: #636363;
            path {
                fill: #636363
            }

            &.selected {
                path {
                    fill: #fff !important;
                    stroke: none !important;
                }
            }
        }

        .preview-icons {
            position: absolute;
            bottom: 15px;
            left: 15px;
            svg {
                fill: #000;
                path {
                    fill: #000;
                }
            }
        }

        svg:hover {
            fill: #fff;
            path {
                fill: #fff;
            }
        }

        &:hover {
            .overlay {
                opacity: 1;
            }

            .preview-icons {
                display: none;
            }

            button.delete {
                display: block;
            }
            button.background {
                display: block;
            }
        }
        button.background, button.delete {
            display: none;
        }
    }
</style>