<template>
    <div class="container">
        <div class="left">
            <Canvas :canvasData="canvasData"></Canvas>
        </div>
        <div class="right">
            <cg-button
                    @click="renderCanvas"
                    button-style="transparent">
                Recreate
            </cg-button>
            <div class="controls">
                <div class="asset-controls">
                    <cg-button
                            v-on:click="changeTab"
                            button-style="transparent">
                        Select Asset Packs
                    </cg-button>
                    <div class="selected-asset-packs">
                        <asset-circle
                                v-for="(asset, index) in selectedAssetPacks" :key="index"
                                :name="asset.id"
                                color="#eee" />
                    </div>
                </div>
                <div class="formats">
                    <div
                            class="format"
                            @click="setRatio('1:1')">
                        <div
                                class="box"
                                :class="[ canvasData.ratio === '1:1' ? 'selected' : '' ]">
                        </div>
                        1:1
                    </div>
                    <div
                            class="format"
                            @click="setRatio('2:3')">
                        <div
                                class="box"
                                :class="[ canvasData.ratio === '2:3' ? 'selected' : '' ]">
                        </div>
                        2:3
                    </div>
                </div>
                <div class="frame">
                    <cg-checkbox v-model="canvasData.frame">Frame</cg-checkbox>
                </div>
                <cg-button @click="buyImage">Submit</cg-button>
            </div>
        </div>
    </div>
</template>

<script>
  import {
    pickTenRandoms,
    generatePacks,
    calculatePrice,
    calculateFirstSeed,
    convertSeed,
  } from 'services/ethereumService';
  import Canvas from './Canvas.vue';
  import * as utils from 'services/utils';
  import * as imageService from 'services/imageService';
  import * as ipfsService from 'services/ipfsService';
  import { mapGetters } from 'vuex';
  import { METAMASK_ADDRESS, USERNAME } from 'store/user-config/types';

  export default {
    name: 'GraphicBuilder',
    components: {
      Canvas
    },
    data: () => ({
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
      },
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
      imagePrice: 0,
      potentialAssets: [],
      allAssets: [],
      selectedPacks: [],
    }),
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
        username: USERNAME,
      })
    },
    props: ['selectedAssetPacks'],
    methods: {

      async buyImage() {
        let canvas = Canvas.methods.getCanvasElement();
        let image = canvas.toDataURL('image/png');
        let ipfsHash = await ipfsService.uploadFile(image.substr(22));
        let pot = this.selectedPacks.map(assetPack =>
          assetPack.data.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);

        let img = await imageService.createImage(
          this.randomHashIds,
          this.timestamp,
          this.iterations,
          pot,
          this.username,
          this.userAddress,
          this.imagePrice,
          ipfsHash);

        // console.log('THIS IS IMAGE: ' + image);
        // console.log(pot);
        // console.log('RANDOM HASHES: ' + this.randomHashIds);
        // console.log('TIMESTAMP: ' + this.timestamp);
        // console.log('ITERATIONS: ' + this.iterations);
        // console.log('POTENTIAL ASSETS: ' + pot);
        // console.log('MM ACCOUNT: ' + this.userAddress);
        // console.log('IMAGE PRICE: ' + this.imagePrice);
        // console.log(img);
        // this.timestamp = new Date().getTime();
        // this.randomSeed = await functions.calculateFirstSeed(this.timestamp, this.randomHashIds);
        // this.iterations = 0;
      },
      async renderCanvas() {
        if (window.sessionStorage.length > 0) {
          this.selectedPacks = this.selectedPacks.concat(generatePacks());
          this.selectedPacks = [...new Set([...this.selectedPacks, ...generatePacks()])];
        }
        this.selectedPacks = [...new Set([...this.selectedPacks, ...this.selectedAssetPacks])];
        let pot = this.selectedPacks.map(assetPack =>
          assetPack.data.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);
        console.log(pot);
        this.canvasData.assets = await imageService.getData(this.randomSeed, this.iterations, utils.encode(pot), this.allAssets);
        this.iterations++;
        console.log('iteration: ' + this.iterations);
        let picked = [];
        for (let i = 0; i < this.canvasData.assets.length; i++) {
          picked.push(this.canvasData.assets[i].id);
        }
        let price = await calculatePrice(picked, this.userAddress);

        if (pot.length === 0) {
          this.imagePrice = 0;
        }
        this.imagePrice = parseInt(price, 10);
        console.log('PRICE : ' + this.imagePrice);
      },
      changeTab() {
        this.$emit('tabChange', 'picker');
      },
      setRatio(ratio) {
        this.canvasData.ratio = ratio;
      }
    },
    async created() {
      if (window.sessionStorage.length > 0) {
        this.randomHashIds = JSON.parse(sessionStorage.getItem('random_hash_ids'));
        this.timestamp = sessionStorage.getItem('timestamp');
        this.iterations = sessionStorage.getItem('iterations');
        this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(this.randomSeed);
        console.log('Random hash ids: ' + this.randomHashIds);
        console.log('Random seed ' + this.randomSeed);
        console.log('Iterations: ' + this.iterations);
        console.log('Timestamp : ' + this.timestamp);
        await this.renderCanvas();
        window.sessionStorage.clear();
      }
    },
    async beforeCreate() {
      //If session storage is empty then we will generate new params
      if (window.sessionStorage.length == 0) {
        this.randomHashIds = pickTenRandoms();
        this.timestamp = new Date().getTime();
        this.iterations = 0;
        this.allAssets = await imageService.loadDataForAssets();
        this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(this.randomSeed);
      }
    },

    watch: {
      selectedAssetPacks: async function () {
        this.selectedPacks = this.selectedAssetPacks;
        this.iterations = 0;
        this.timestamp = new Date().getTime();
        this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
        this.randomSeed = await convertSeed(this.randomSeed);
      }
    }
  };
</script>

<style scoped lang="scss">
    .container {
        position: relative;
        .left {
            flex-shrink: 1;
        }
        .right {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            flex-grow: 1;
            margin-left: 50px;
            max-width: 400px;
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
                align-items: flex-start;
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
        display: flex;
        .asset {
            margin: 20px 5px 0;
            border-color: #000;
            &:last-of-type {
                margin-right: 0;
            }
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
        display: inline-flex;
        flex-direction: column;
        align-items: flex-end;
        .asset-controls {
            margin-bottom: 100px;
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .frame {
            margin-bottom: 20px;
        }
    }
</style>