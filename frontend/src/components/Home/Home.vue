<template>
    <div>
        <slider-gallery></slider-gallery>
        <div class="test-image">
            <Canvas id="canv" :canvasData="canvasData"></Canvas>
        </div>
        <div>
            <button @click="renderCanvas"> Recompose </button>
            <button @click="openInEditor"> Open in editor </button>
        </div>
        <home-gallery :displayFilters="true" :images="blocks"></home-gallery>
        <Footer></Footer>
    </div>
</template>

<script>
  import SliderGallery from '../SliderGallery/SliderGallery.vue';
  import HomeGallery from './HomeGallery/HomeGallery.vue';
  import Footer from '../Footer/Footer.vue';
  import Canvas from "../Canvas";

  import * as functions from "../../../scripts/functions";
  import * as methods from "../../methods";
  import * as utils from "../../../scripts/utils";

  export default {
      name: 'about',
      components: {
          SliderGallery,
          Footer,
          HomeGallery,
          Canvas,
      },
      data: () => ({
          random_seed: 0,
          iterations: 0,
          timestamp: new Date().getTime(),
          random_hash_ids: functions.pickTenRandoms(),
          all_assets: [],
          asset_packs : [],
          canvasData: {
              assets: [],
              ratio: '2:3',
              frame: false,
          },
          blocks: [
              {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              },
              {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/long.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/long.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              },
              {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              },
              {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/long.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/long.png'),
              }, {
                  address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
                  name: 'The point of',
                  price: 0.45,
                  src: require('./HomeGallery/assets/wide.png'),
              },
          ],
      }),

      methods: {
          async renderCanvas() {
              let pot = this.asset_packs.map(assetPack =>
                  assetPack.data.map(asset => parseInt(asset.id)))
                  .reduce((a, b) => a.concat(b), []);
              console.log(pot);
              console.log("RANDOM SEED: " + this.random_seed);
              console.log("ITERATIONS: " + this.iterations);
              console.log("TIMESTAMP: " + this.timestamp);
              this.canvasData.assets = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.all_assets);
              this.iterations++;
              console.log('iteration: ' + this.iterations);
              let picked = [];
              for (let i = 0; i < this.canvasData.assets.length; i++) {
                  picked.push(this.canvasData.assets[i].id);
              }
          },
          openInEditor() {
              window.sessionStorage.setItem("random_hash_ids", JSON.stringify(this.random_hash_ids));
              window.sessionStorage.setItem("iterations", this.iterations - 1);
              window.sessionStorage.setItem("timestamp", this.timestamp);
          }
      },
      async beforeCreate() {
          this.random_hash_ids = functions.pickTenRandoms();
          this.timestamp = new Date().getTime();
          this.iterations = 0;
          this.all_assets = await methods.loadDataForAssets();
          this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
          this.random_seed = await functions.convertSeed(this.random_seed);
          this.asset_packs = functions.generatePacks();
      },
  };
</script>

<style scoped>
    canvas {
        margin-top: 20px;
        background-color: white;
        border: 1px solid blue;
        margin-left: 400px;
    }
    div.test-image {
        height: 561px;
        width: 400px;
        border: 1px solid black;
    }


</style>