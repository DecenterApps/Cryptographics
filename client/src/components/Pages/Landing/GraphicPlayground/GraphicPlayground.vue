<template>
    <div class="hero">
        <div class="container">
            <div class="left">
                <div class="create-art">
                    <div class="canvas-holder">
                        <overlay>
                            <cg-button button-style="transparent-inverted" icon-type="download" @click="openInEditor">
                                Open in editor
                            </cg-button>
                        </overlay>
                        <div class="canvas-holder-wrapper">
                            <Canvas :canvasData="canvasData" height="400" width="400" />
                        </div>
                    </div>
                    <!--<div class="button-group">-->
                    <!--<cg-button-->
                    <!--button-style="transparent"-->
                    <!--@click="openInEditor"-->
                    <!--&gt;-->
                    <!--Open in editor-->
                    <!--</cg-button>-->
                    <!--<cg-button-->
                    <!--@click="renderCanvas">-->
                    <!--Recompose-->
                    <!--</cg-button>-->
                    <!--</div>-->
                </div>
            </div>
            <div class="right">
                <h2 class="large-title">This is a Cryptographic</h2>
                <div class="hero-text-content">
                    <p>A graphic created by you, with a little help from provably secure randomness. </p>
                    <p>It uses assets uploaded by artists to create this one-of-a-kind piece that you can store and
                        trade.</p>
                    <p>Try creating another one.</p>
                    <cg-button
                            @click="renderCanvas">
                        Recompose
                    </cg-button>
                </div>
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

<style scoped lang="scss">
    .hero {
        background-color: #D9D9D9;
        padding: 45px 0;
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
                padding-left: 20px;

                .hero-text-content {
                    max-width: 300px;

                    p {
                        color: #000;
                        font-family: Roboto, sans-serif;
                        font-size: 14px;
                        line-height: 19px;
                        font-weight: 300;
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
                            margin: 20px 0;
                        }
                    }

                }
                .right {
                    margin-bottom: 30px;
                    text-align: center;
                    p {
                        margin: 0 auto 16px;
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
        position: relative;
        margin: 0 20px;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;

        .canvas-holder-wrapper {
            height: 402px;
            width: 402px;
        }

        &:hover {
            .overlay {
                opacity: 1;
            }
        }
        canvas {
            background-color: white;
            width: 100%;
        }
        .cg-stamp {
            padding: 20px 0;
        }
    }
</style>