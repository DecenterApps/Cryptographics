<template>
    <div class="hero">
        <div class="canvas-holder-wrapper" @click="renderCanvas();">
            <Canvas :canvasData="canvasData" />
            <div class="tap-to-recompose mobile"><span>Tap to recompose</span></div>
            <div class="tap-to-recompose desktop"><span>Click to recompose</span></div>
        </div>
        <div class="right">
            <div class="button-group hero-mobile-cta">
                <cg-button button-style="primary" @click="openInEditor();">
                    Continue in Composer
                </cg-button>
            </div>
            <h2 class="large-title">This is a <br> cryptographic</h2>
            <div class="hero-text-content">
                <p>A graphic created by you, with a little help from provably secure randomness. </p>
                <p>It uses assets uploaded by artists to create this one-of-a-kind piece that you can store and
                    trade.</p>
                <p>Try creating another one and save your favorite on the blockchain.</p>
            </div>
            <div class="button-group hero-button-group">
                <cg-button button-style="primary" @click="openInEditor();">
                    Continue in Composer
                </cg-button>
            </div>
        </div>
    </div>
</template>

<script>
  import {
    pickTenRandoms,
    calculateFirstSeed,
    convertSeed,
    getLandingPacks,
    getImage,
  } from 'services/ethereumService';
  import { ipfsNodePath } from 'config/constants';
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
      randomHashIds: [],
      selectedAssets: [],
      potentialAssets: [],
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: true,
      },
      coverIpfsHashes: [],
    }),
    methods: {
      async renderCanvas() {
        this.iterations++;
        let potentialAssets = shuffleArray(this.selectedAssets);
        potentialAssets = potentialAssets.slice(0, 30);
        console.log('RANDOM SEED: ' + this.randomSeed);
        console.log('ITERATIONS: ' + this.iterations);
        console.log('TIMESTAMP: ' + this.timestamp);
        console.log('POTENTIAL ASSETS: ' + potentialAssets);
        const finalAssets = await getImage(this.randomSeed, this.iterations, potentialAssets);
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
        this.$router.push('/create-cryptographic');
      },
      download() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          const title = 'cryptographics-playground';
          link.setAttribute('download', title + '.jpeg');
          link.setAttribute('href', window.URL.createObjectURL(blob));
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 'image/jpeg');
      },
    },
    async created() {
      this.randomHashIds = pickTenRandoms();
      console.log('RANDOM HASH IDS', this.randomHashIds);
      this.timestamp = new Date().getTime();
      this.iterations = 0;
      this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
      this.randomSeed = await convertSeed(this.randomSeed);
      const landingPacks = getLandingPacks();
      this.assetPacks = landingPacks.packs;
      this.selectedAssets = this.assetPacks.map(assetPack =>
        assetPack.assets.map(item => parseInt(item.id)))
        .reduce((a, b) => a.concat(b), []);
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
        cursor: pointer;
        @media (min-width: 768px) {
            &:hover {
                .tap-to-recompose {
                    opacity: 1;
                }
            }
        }

        @media screen and (max-width: 1024px) {
            margin-bottom: 427px;
        }

        canvas {
            height: 100%;
            width: 100%;
        }

        .tap-to-recompose {
            position: absolute;
            left: 12px;
            top: 12px;
            width: 226px;
            height: 293px;
            background-color: rgba(0, 0, 0, .5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            color: white;
            animation: fade-out 2s;
            pointer-events: none;
            opacity: 0;
            transition: opacity .2s;
            @keyframes fade-out {
                0% { opacity: 1; }
                60% { opacity: 1; }
                100% { opacity: 0; }
            }
            &.mobile { display: none; }
            @media screen and (max-width: 1024px) {
                &.desktop { display: none; }
                &.mobile { display: flex; }
            }
        }
    }
</style>

<style scoped lang="scss">
    .hero {
        position: relative;
        background: url('../assets/home-header.jpg') center center no-repeat;
        height: 566px;
        padding: 45px 0;
        @media screen and (max-width: 1024px) {
            background-position: 50% -50px;
            padding-top: 0;
            height: 836px;
            background-color: #eee;
        }

        .right {
            position: absolute;
            left: calc(50% + 200px);
            text-align: left;
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: center;
            padding: 20px;
            top: 0;
            bottom: 0;
            min-width: 300px;
            @media screen and (max-width: 1024px) {
                position: relative;
                left: 0;
                top: 530px;
            }

            .large-title {
                line-height: 39px;
            }

            .hero-text-content {
                max-width: 315px;
                @media screen and (max-width: 1024px) {
                    max-width: none;
                }
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


            .button-group button {
                margin: 0;
            }
            @media screen and (max-width: 1024px) {
                .button-group { display: none; }
            }

            .hero-mobile-cta {
                text-align: center;
                display: none;
                position: absolute;
                top: -80px;
                left: 0;
                right: 0;
                @media screen and (max-width: 1024px) {
                    display: block;
                }
            }

            .hero-button-group .button {
                text-transform: none;
            }
        }
    }
</style>
