<template>
    <div class="hero">
        <div class="canvas-holder">
            <overlay>
                <cg-button button-style="transparent-inverted" icon-type="download" @click="openInEditor">
                    Open in editor
                </cg-button>
                <cg-button
                        @click="renderCanvas">
                    Recompose
                </cg-button>
            </overlay>
            <div class="canvas-holder-wrapper">
                <Canvas :canvasData="canvasData" />
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
  } from 'services/ethereumService';
  import { ipfsNodePath } from 'config/constants';
  import { getFinalAssets, loadDataForAssets } from 'services/imageService';
  import * as utils from 'services/utils';
  import Gallery from 'shared/Gallery/Gallery.vue';
  import Canvas from 'pages/CreateGraphic/GraphicBuilder/Canvas';
  import { getCoversForAssetPacks } from 'services/ethereumService';
  import { shuffleArray } from 'services/helpers';

  export default {
    name: 'GraphicPlayground',
    components: {
      Canvas,
      Gallery
    },
    props: ['width'],
    data: () => ({
      ipfsNodePath,
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
      allAssets: [],
      assetPacks: [],
      selectedAssets: [],
      potentialAssets: [],
      canvasData: {
        assets: [],
        ratio: '1:1',
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
        const link = document.createElement('a');
        const title = 'cryptographics-playground';
        link.setAttribute('download', title + '.jpeg');
        link.setAttribute('href', canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream'));
        link.click();
      },
    },
    async beforeCreate() {
      this.randomHashIds = pickTenRandoms();
      this.timestamp = new Date().getTime();
      this.iterations = 0;
      this.allAssets = await loadDataForAssets();
      this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
      this.randomSeed = await convertSeed(this.randomSeed);
      const landingPacks = getLandingPacks();
      this.assetPacks = landingPacks.packs;
      this.selectedAssets = landingPacks.assetIds;
      this.renderCanvas();
      this.coverIpfsHashes = await getCoversForAssetPacks(landingPacks.ids);
    }
  };
</script>

<style lang="scss">
    .canvas-holder-wrapper {
        canvas {
            height: 2480px !important;
            width: 2480px !important;
            max-width: none;
        }
    }
</style>

<style scoped lang="scss">
    .hero {
        position: relative;
        background-color: #D9D9D9;
        overflow: hidden;
        padding: 45px 0;
        height: 568px;

        .container {
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                justify-content: flex-end;
            }

            .right {
                text-align: left;
                display: flex;
                flex-direction: column;
                flex: 1;
                justify-content: center;
                padding: 20px;

                .hero-text-content {
                    max-width: 300px;

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
            @media screen and (max-width: 1120px) {
                flex-direction: column;
                .left {
                    flex-direction: column;
                    .create-art {
                        flex-direction: column-reverse;
                        align-items: center;
                        .button-group {
                            flex-direction: row;
                            align-items: center;
                            margin-bottom: 30px;
                        }
                        .canvas-wrapper {
                        }
                    }

                }
                .right {
                    text-align: center;

                    .hero-text-content {
                        max-width: 340px;
                        margin: 0 auto;
                        p {
                            margin: 0 auto 16px;
                        }
                    }
                }
            }
        }
    }

    .create-art {
        display: flex;
        .button-group {
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            & > > > button {
                min-width: 100px;
                margin-bottom: 20px;
                &:last-of-type {
                    margin: 0;
                }

                .button {
                    min-width: 120px;
                }
            }
        }
    }

    .canvas-holder {
        position: absolute;
        top: -30%;
        left: -10%;
        margin: 0 20px;
        height: 568px;
        width: 100%;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;

        .canvas-holder-wrapper {
            height: 568px;
            width: 100%;
        }

        &:hover {
            .overlay {
                opacity: 1;
            }
        }
        .cg-stamp {
            padding: 20px 0;
        }
    }
</style>