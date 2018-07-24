<template>
    <div class="art-builder-wrapper">
        <div class="left-group">
            <Canvas :canvasData="canvasData"></Canvas>
        </div>
        <div class="right-group">
            <div class="recreate" @click="renderCanvas">
                <cg-button button-style="transparent">Recreate</cg-button>
            </div>
            <div class="controls">
                <cg-button
                    v-on:click="changeTab"
                    button-style="transparent">Select Asset Packs</cg-button>
                <div class="selected-asset-packs">
                    <div class="asset-pack-circle small selected" v-for="(asset, index) in selectedAssetPacks" :key="index">
                        {{asset.id}}
                    </div>
                </div>
                <div class="formats">
                    <div class="first-format" v-on:click="setRatio('1:1')">
                        <div class="box"></div>
                        1:1
                    </div>
                    <div class="second-format" v-on:click="setRatio('2:3')">
                        <div class="box"></div>
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
  import Canvas from './Canvas.vue';

  import IPFS from 'ipfs';
  import * as utils from '../../../../../scripts/utils';
  import * as functions from '../../../../../scripts/functions';
  import * as methods from '../../../../methods';
  import { getAccounts } from '../../../../../scripts/helpers';
  import * as ipfsService from '../../../../../scripts/ipfsService';

  export default {
    name: 'ArtBuilder',
    components: { Canvas },
    data: () => ({
      metamask_account: 0,
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
      },
      random_seed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      random_hash_ids: functions.pickTenRandoms(),
      image_price: 0,
      potential_assets: [],
      all_assets: [],
      selected_packs: [],
      username: undefined
    }),
    props: ['selectedAssetPacks'],
    methods: {

      async buyImage() {

        if (!this.username) {
            this.username = window.prompt('Enter your username: ');
        }

        let canvas = Canvas.methods.getCanvasElement();
        let image = canvas.toDataURL('image/png');
        let ipfsHash = await ipfsService.uploadFile(image.substr(22));
        let pot = this.selected_packs.map(assetPack =>
        assetPack.data.map(asset => parseInt(asset.id)))
        .reduce((a, b) => a.concat(b), []);

        let img = await methods.createImage(
            this.random_hash_ids, 
            this.timestamp, 
            this.iterations - 1, 
            pot, 
            this.username, 
            this.metamask_account, 
            this.image_price, 
            ipfsHash);

        // console.log('THIS IS IMAGE: ' + image);
        // console.log(pot);
        // console.log('RANDOM HASHES: ' + this.random_hash_ids);
        // console.log('TIMESTAMP: ' + this.timestamp);
        // console.log('ITERATIONS: ' + this.iterations);
        // console.log('POTENTIAL ASSETS: ' + pot);
        // console.log('MM ACCOUNT: ' + this.metamask_account);
        // console.log('IMAGE PRICE: ' + this.image_price);
        // console.log(img);
        // this.timestamp = new Date().getTime();
        // this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
        // this.iterations = 0;
      },
      async renderCanvas() {
        if(window.sessionStorage.length > 0) {
            this.selected_packs = this.selected_packs.concat(functions.generatePacks());
            this.selected_packs = [...new Set([...this.selected_packs ,...functions.generatePacks()])];
        }
        this.selected_packs = [...new Set([...this.selected_packs, ...this.selectedAssetPacks])];
        let pot = this.selected_packs.map(assetPack =>
          assetPack.data.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);
        console.log(pot);
        this.canvasData.assets = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.all_assets);
        this.iterations++;
        console.log('iteration: ' + this.iterations);
        let picked = [];
        for (let i = 0; i < this.canvasData.assets.length; i++) {
          picked.push(this.canvasData.assets[i].id);
        }
        let price = await functions.calculatePrice(picked, this.metamask_account);

        if (pot.length === 0) {
          this.image_price = 0;
        }
        this.image_price = parseInt(price, 10);
          console.log("PRICE : " + this.image_price);
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
              this.random_hash_ids = JSON.parse(sessionStorage.getItem("random_hash_ids"));
              this.timestamp = sessionStorage.getItem("timestamp");
              this.iterations = sessionStorage.getItem("iterations");
              this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
              this.random_seed = await functions.convertSeed(this.random_seed);
              console.log("Random hash ids: " + this.random_hash_ids);
              console.log("Random seed " + this.random_seed);
              console.log("Iterations: " + this.iterations);
              console.log("Timestamp : " + this.timestamp);
              await this.renderCanvas()
              window.sessionStorage.clear();
          }
      },
    async beforeCreate() {
        this.metamask_account = await getAccounts();
        //If session storage is empty then we will generate new params
        if(window.sessionStorage.length == 0) {
          this.random_hash_ids = functions.pickTenRandoms();
          this.timestamp = new Date().getTime();
          this.iterations = 0;
          this.all_assets = await methods.loadDataForAssets();
          this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
          this.random_seed = await functions.convertSeed(this.random_seed);
        }
      window.node = new IPFS({
        repo: 'cryptographics',
        config: {
          Bootstrap: ipfsService.bootstrapNodes,
          Addresses: {
            Swarm: [],
          },
        }
      });

    },

    watch: {
      selectedAssetPacks: async function () {
        this.selected_packs = this.selectedAssetPacks;
        this.iterations = 0;
        this.timestamp = new Date().getTime();
        this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
        this.random_seed = await functions.convertSeed(this.random_seed);
      }
    }
  };
</script>

<style scoped lang="scss">
    .art-builder-wrapper {
        display: flex;
        height: 100%;
        position: relative;
        justify-content: space-between;

        .left-group {
            flex-shrink: 1;

            img {
                height: 100%;
            }

        }

        .right-group {
            box-sizing: border-box;
            padding: 0 30px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            flex-grow: 1;
            min-width: 300px;
        }

        .selected-asset-packs {
            margin-bottom: 20px;

            .asset-pack-circle {
                margin: 20px 12px 0;

                &:last-child {
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

            .first-format, .second-format {
                text-align: right;
                cursor: pointer;
            }

            .first-format {

                .box {
                    width: 38px;
                    height: 38px;
                    background-color: #fff;
                    margin-bottom: 5px;
                }

                margin-right: 20px;
            }
            .second-format {

                .box {
                    width: 28px;
                    height: 38px;
                    background-color: #000;
                    margin-bottom: 5px;
                }

            }
        }

        .frame {
            font-size: 10px;
            color: #7c7c7c;
            text-align: right;
        }

        .default-button.submit {
            background-color: #000;
            color: #fff;
            float: right;
            margin-top: 20px;
        }

        @media all and (max-width: 1280px) {
            .right-group {
                .recreate {
                    margin-right: 50px
                }
            }

        }
    }
</style>