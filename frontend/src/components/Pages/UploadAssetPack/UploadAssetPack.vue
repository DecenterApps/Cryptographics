<template>
    <layout layout-style="pulled-left">
                <div class="left">
                    <div class="up">
                        <h1 class="large-title">Upload asset pack</h1>
                        <div class="input-group">
                            <cg-input name="pack_name" placeholder="Asset Pack name"/>
                            <cg-input name="price" placeholder="Value"/>                    
                        </div>
                    </div>
                    <div class="down">
                        <input-file
                            id="files"
                            button-style="transparent"
                            @change="uploadAssets">
                            <span>Upload multiple assets</span>
                            <span>Assets in pack {{ assets.length }} of {{ maxAssets }}</span>
                        </input-file>
                        <div class="graphic-preview">
                            <canvas id="canvas"></canvas>
                            <cg-button
                                button-style="transparent">
                                Generate
                            </cg-button>
                        </div>
                        <div class="button-group">
                            <cg-button
                                @click="uploadToIpfs">
                                Submit
                            </cg-button>
                            <cg-button
                                button-style="transparent"
                                @click="renderCanvas">
                                Try
                            </cg-button>
                            <button-link to="/asset-packs" button-style="no-border">
                                Cancel
                            </button-link>
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
                        <img :src="asset.path" />
                        <overlay :class="asset.attribute === 122 ? 'bg-selected' : ''">
                            <ico-background @click.native="toggleBackground(index)" />
                            <ico-trash @click.native="remove(index)" />
                        </overlay>
                    </div>
                </div>
            </div>
        </div>
    </layout>
</template>

<script>
  import * as ipfsService from 'services/ipfsService';
  import { getAccounts } from 'services/helpers';
  import { createAssetPack, makeCoverImage } from 'services/imageService';
  import * as utils from 'services/utils';

  import IcoTrash from './template/IcoTrash.vue';
  import IcoBackground from './template/IcoBackground.vue';

  export default {
    name: 'UploadAssetPack',
    components: {
        IcoTrash,
        IcoBackground
        },
    data: () => ({
      maxAssets: 50,
      metamask_account: 0,
      assets: [],
      canvasData: {
        assets: [],
        ratio: '1:1',
        frame: false,
      },
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
        let canvas = document.getElementById('canvas');
        canvas.width = 350;
        canvas.height = 350;
        // const propComparator = (propName) =>
        //     (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1;
        // this.assets.sort(propComparator('attribute'));
        console.log(this.assets);
        let asset_paths = [];
        for (let i = 0; i < this.assets.length; i++) {
          asset_paths.push(this.assets[i].path);
        }
        makeCoverImage(false, asset_paths, canvas, 350, 350);
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
        let assets = this.assets;
        let canvas = document.getElementById('canvas');
        canvas.width = 350;
        canvas.height = 350;
        let asset_paths = [];
        for (let i = 0; i < this.assets.length; i++) {
          asset_paths.push(this.assets[i].path);
        }
        makeCoverImage(false, asset_paths, canvas, 350, 350);
      },

      toggleBackground(index) {
        console.log(index);
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
.left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .up {
        margin-bottom: 90px;
    }
    .input-group {
        width: 100%;
        .input {
            &:first-of-type {
                width: 69%;
                flex: 0 0 69%;
            }
            &:last-of-type {
                width: 29%;
                flex: 0 0 29%;
            }
        }
    }
    .input-file {
        margin-bottom: 30px;
    }
    .button-group {
        display: inline-flex;
        .button {
            margin: 0 5px;
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
            width: 220px;
            height: 120px;
        }
        .button {
            margin-left: 10px;
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
    .overlay {
        &.bg-selected {
            .ico-background {
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
</style>