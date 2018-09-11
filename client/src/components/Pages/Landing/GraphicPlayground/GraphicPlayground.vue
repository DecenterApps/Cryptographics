<template>
    <div class="hero">
        <div class="canvas-holder-wrapper">
            <Canvas :canvasData="canvasData" />
        </div>
        <div class="right">
            <h2 class="large-title">This is a <br> Cryptographic</h2>
            <div class="hero-text-content">
                <p>A graphic created by you, with a little help from provably secure randomness. </p>
                <p>It uses assets uploaded by artists to create this one-of-a-kind piece that you can store and
                    trade.</p>
                <p>Try creating another one.</p>
            </div>
            <div class="button-group">
                <cg-button
                        @click="renderCanvas">
                    Recompose
                </cg-button>
                <cg-button button-style="tab-active" icon-type="download" @click="openInEditor">
                    continue in editor
                </cg-button>
            </div>
        </div>
        <!--<div class="container">-->
        <!--<div class="left">-->
        <!--<div class="create-art">-->
        <!--<div class="canvas-holder">-->
        <!--<overlay>-->
        <!--<cg-button button-style="transparent-inverted" icon-type="download" @click="openInEditor">-->
        <!--Open in editor-->
        <!--</cg-button>-->
        <!--</overlay>-->
        <!--<div class="canvas-holder-wrapper">-->
        <!--<Canvas :canvasData="canvasData" height="400" width="400" />-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="right">-->
        <!--<h2 class="large-title">This is a Cryptographic</h2>-->
        <!--<div class="hero-text-content">-->
        <!--<p>A graphic created by you, with a little help from provably secure randomness. </p>-->
        <!--<p>It uses assets uploaded by artists to create this one-of-a-kind piece that you can store and-->
        <!--trade.</p>-->
        <!--<p>Try creating another one.</p>-->
        <!--<cg-button-->
        <!--@click="renderCanvas">-->
        <!--Recompose-->
        <!--</cg-button>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
  import {
    pickTenRandoms,
    calculateFirstSeed,
    convertSeed,
    getLandingPacks,
  } from 'services/ethereumService';
  import { ipfsNodePath } from 'config/constants';
  import { getFinalAssets, loadDataForAssets } from 'services/imageService';
  import * as utils from 'services/utils';
  import Canvas from 'pages/CreateGraphic/GraphicBuilder/Canvas';
  import { shuffleArray } from 'services/helpers';
  import { SELECTED_ASSET_PACKS } from 'store/canvas/types';
  import { mapGetters } from 'vuex';

  export default {
    name: 'GraphicPlayground',
    components: {
      Canvas,
    },
    props: ['width'],
    data: () => ({
      ipfsNodePath,
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
      allAssets: [],
      selectedAssets: [],
      potentialAssets: [],
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: true,
      },
      coverIpfsHashes: [],
    }),
    computed: {
      ...mapGetters({
        assetPacks: SELECTED_ASSET_PACKS,
      })
    },
    methods: {
      async renderCanvas() {
        this.iterations++;
        let potentialAssets = shuffleArray(this.selectedAssets);
        potentialAssets = potentialAssets.slice(0, 30);
        console.log('RANDOM SEED: ' + this.randomSeed);
        console.log('ITERATIONS: ' + this.iterations);
        console.log('TIMESTAMP: ' + this.timestamp);
        console.log('POTENTIAL ASSETS: ' + potentialAssets);
        const finalAssets = await getFinalAssets(this.randomSeed, this.iterations, utils.encode(potentialAssets), this.allAssets);
        this.canvasData.assets = this.addSourceItem(this.assetPacks, finalAssets);
        this.potentialAssets = potentialAssets;
        console.log('iteration: ' + this.iterations);

      },
      addSourceItem(data, assets) {
        const packs = this.assetPacks.reduce((a, b) => a.concat(b.assets), []);
        return assets.map(asset => {
          const index = packs.findIndex((item) => parseInt(item.id) === parseInt(asset.id));
          return {
            ...asset,
            src: packs[index].src,
          };
        });
      },
      openInEditor() {
        window.sessionStorage.setItem('randomHashIds', JSON.stringify(this.randomHashIds));
        window.sessionStorage.setItem('iterations', (this.iterations - 1).toString());
        window.sessionStorage.setItem('timestamp', this.timestamp);
        window.sessionStorage.setItem('potentialAssets', JSON.stringify(this.potentialAssets));
        this.$router.push('/create-graphic');
      },
      download() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          const title = 'cryptographics-playground';
          link.setAttribute('download', title + '.jpeg');
          link.setAttribute('href', window.URL.createObjectURL(blob));
          link.click();
        }, 'image/jpeg');
      },
    },
    async beforeCreate() {
      this.randomHashIds = pickTenRandoms();
      this.timestamp = new Date().getTime();
      this.iterations = 0;
      this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
      this.randomSeed = await convertSeed(this.randomSeed);
      const landingPacks = getLandingPacks();
      // this.assetPacks = landingPacks.packs;
      this.selectedAssets = this.assetPacks.map(assetPack =>
        assetPack.assets.map(item => parseInt(item.id)))
        .reduce((a, b) => a.concat(b), []);
      this.allAssets = await loadDataForAssets();
      this.renderCanvas();
    }
  };
</script>

<style lang="scss">
    .canvas-holder-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto auto;
        height: 351px;
        width: 250px;
        canvas {
            height: 100%;
            width: 100%;
        }
    }
</style>

<style scoped lang="scss">
    .hero {
        /*background-color: #D9D9D9;*/
        position: relative;
        background: url('../assets/home-header.png') center center;
        height: 566px;
        padding: 45px 0;

        .right {
            position: absolute;
            left: calc(50% + 256px);
            text-align: left;
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: center;
            padding: 20px;

            .large-title {
                line-height: 39px;
            }

            .hero-text-content {
                max-width: 250px;

                p {
                    color: #000;
                    font-family: Roboto, sans-serif;
                    font-size: 14px;
                    line-height: 19px;
                    font-weight: 300;
                    letter-spacing: 0;
                }
            }

            p:last-of-type {
                margin-bottom: 30px;
            }
        }
    }
</style>