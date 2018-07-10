<template>
    <div class="upload-assets-page">
        <div class="container main">
            <div class="left-data">
                <h1 class="large-title">Create asset pack</h1>
                <div class="input-data">
                    <input class="pack-name" name="pack_name" type="text" placeholder="Asset Pack name" />
                    <label for="files" class="default-button no-background file-upload-button">
                        <span>Browse</span>
                        <input class="uploadFiles" id="files" type="file" multiple size="50" @change="uploadAssets">
                    </label>
                </div>
                <input class="pack-price" name="price" type="text" placeholder="Value" />
                <div class="number-of-assets">
                    <span> Assets in pack 15-20 </span>
                </div>

                <div class="buttons">
                    <button class="default-button submit" @click="uploadToIpfs"> Submit</button>
                    <button class="default-button no-background try" @click="renderCanvas"> Try</button>
                </div>
                <div>
                    <canvas id="canvas"></canvas>
                </div>
            </div>

            <div class="right-data">
                <div class="asset" v-for="asset, index in assets">
                    <img :src="asset.path" />

                    <div class="overlay" v-bind:class="asset.attribute === 122 ? 'bg-selected' : ''">
                        <IconBackground @click.native="toggleBackground(index)"></IconBackground>
                        <IconTrash @click.native="remove(index)"></IconTrash>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import * as ipfsService from '../../../scripts/ipfsService.js';
  import { getAccounts } from '../../../scripts/helpers';
  import {createAssetPack, makeCoverImage} from '../../methods';
  import * as utils from '../../../scripts/utils';
  import IconTrash from './template/IconTrash.vue';
  import IconBackground from './template/IconBackground.vue';

  export default {
    name: 'upload-asset-packs',
    components: {
        IconTrash, IconBackground },
    data: () => ({
      metamask_account: 0,
      assets: [],
      canvasData: {
            assets: [],
            ratio: '1:1',
            frame: false,
        },
      canvas_ratio: '1:1'
    }),

    methods: {
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
          let assets = this.assets;
          this.canvasData.assets = [];
          for(let i=0; i<assets.length; i++) {
              this.canvasData.assets.push(assets[i].path);
          }
          let canvas = document.getElementById('canvas');
          canvas.width = 350;
          canvas.height = 350;

          console.log(canvas);
          makeCoverImage(this.canvasData.assets, canvas, 350,350);
      },
      async uploadToIpfs() {
        let hashes = [];
        let counter = this.assets.length;
        let canvas = document.getElementById('canvas');
        let coverImage = canvas.toDataURL('image/png');
        let coverHash = await ipfsService.uploadFile(coverImage.substr(22));
        const price = document.querySelector('input[name=price]').value;
        const name = document.querySelector('input[name=pack_name').value;
        for (let i = 0; i < this.assets.length; i++) {
          let reader = new FileReader();
          reader.onload = async (event) => {
            let ipfsHash = await ipfsService.uploadFile(event.target.result.substr(22));
            hashes.push(utils.getBytes32FromIpfsHash(ipfsHash));
            counter--;
            if (counter === 0) {
              console.log(hashes);
              console.log(price);
              const attributes = this.assets.map(item => item.attribute);
              await createAssetPack(utils.getBytes32FromIpfsHash(coverHash), name, attributes, hashes, price, this.metamask_account);
            }
          };
          reader.readAsDataURL(this.assets[i].file);
        }
      },

      remove(index) {
        this.assets.splice(index, 1);
      },

      toggleBackground(index) {
        if (this.assets[index].attribute === 122) {
          return this.assets[index].attribute = 222;
        }
        this.assets[index].attribute = 100 + this.assets[index].attribute % 100;
      }
    },

    async beforeCreate() {
      this.metamask_account = await getAccounts();
    },

  };
</script>

<style scoped lang="scss">

    canvas {
        margin-top: 20px;
        background-color: white;
        /*width:350px;*/
        /*height: 350px;*/
    }
    .upload-assets-page {
        background: #D9D9D9;
        min-height: calc(100vh - 70px);
        font-size: 12px;
    }

    .number-of-assets {
        margin-top: 17px;

        span {
            font-size: 12px;
            font-family: 'Roboto', sans-serif;
        }
    }

    .input-data {
        display: flex;
    }

    input:not([type=file]) {
        border-radius: 5px;
        background-color: #D9D9D9;
        border: 1px solid #000;
        box-shadow: none;
        padding: 9px 15px;
        box-sizing: border-box;
        font-size: 12px;
        outline: none;
        height: 33px;
        margin-top: 15px;
    }

    input[type=file] {
        display: none;
    }

    .file-upload-button {
        margin-top: 15px;
        width: 90px;
        box-sizing: border-box;
    }

    .pack-name {
        width: 210px;
        margin-right: 20px;
    }

    .pack-price {
        width: 92px;
    }

    input.uploadFiles {
        padding-left: 20px;
    }

    button.uploadFiles {
        border-radius: 5px;
        width: 89px;
        height: 33px;
        margin-left: 20px;
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

        .overlay {
            opacity: 0;
            position: absolute;
            top: 0;
            width: 206px;
            height: 206px;
            background: rgba(0, 0, 0, 0.74);
            transition: opacity 0.3s ease;

            &.bg-selected {
                .icon-background {
                    fill: #fff;
                    path {
                        fill: #fff
                    }
                }
            }
        }

        img {
            width: 180px;
            height: 180px;
        }

        &:nth-child(3n + 2) {
            margin: 0 20px;
        }

        .icon-trash {
            position: absolute;
            top: 15px;
            right: 15px;
        }

        .icon-background {
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

    .large-title {
        margin-bottom: 11px;
    }

    .left-data {
        margin-right: 20px;
    }

    .right-data {
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
    }

    .main {
        display: flex;
        padding-top: 82px;
    }

    .buttons {
        margin-top: 125px;
        display: flex;
        button {
            margin-right: 10px;
        }
    }

    button {
        width: 89px;
        height: 33px;
        border-radius: 5px;
    }

    button.submit {
        background-color: black;
        color: white;
    }

    button.try {
        width: 89px;
    }

</style>