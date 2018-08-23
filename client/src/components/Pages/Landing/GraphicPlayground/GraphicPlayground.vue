<template>
    <div class="hero">
        <div class="container">
            <div class="left">
                <div class="create-art">
                    <div class="canvas-holder">
                        <overlay>
                            <button-icon icon-type="download" @click="download" />
                        </overlay>
                        <div class="canvas-holder-wrapper">
                            <Canvas :canvasData="canvasData"></Canvas>
                        </div>
                    </div>
                    <div class="button-group">
                        <cg-button
                                button-style="transparent"
                                @click="openInEditor"
                        >
                            Open in editor
                        </cg-button>
                        <cg-button
                                @click="renderCanvas">
                            Recompose
                        </cg-button>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="hero-text-content">
                    <h2 class="large-title">Cryptographics</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut.</p>
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

  export default {
    name: 'GraphicPlayground',
    components: {
      Canvas,
      Gallery
    },
    data: () => ({
      ipfsNodePath,
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
      allAssets: [],
      assetPacks: [],
      canvasData: {
        assets: [],
        ratio: '1:1',
        frame: true,
      },
      coverIpfsHashes: [],
    }),
    methods: {
      // renderCanvas() {
      //   let canvas = document.getElementById('canvas');
      //   canvas.width = 350;
      //   canvas.height = 350;
      //
      //   let images_paths = [];
      //   let numberOfImages = Math.floor(Math.random() * 20);
      //   for (let i = 0; i < numberOfImages; i++) {
      //     let val = Math.floor(Math.random() * 30);
      //     if (val == 0) {
      //       val = 1;
      //     }
      //     let path = val < 10 ? '0' + val.toString() : val.toString();
      //     images_paths.push(path);
      //   }
      //   makeCoverImage(true, images_paths, canvas, 350, 350);
      // }
      async renderCanvas() {
        let pot = this.assetPacks.map(assetPack =>
          assetPack.assets.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);
        this.iterations++;
        console.log(pot);
        console.log('RANDOM SEED: ' + this.randomSeed);
        console.log('ITERATIONS: ' + this.iterations);
        console.log('TIMESTAMP: ' + this.timestamp);
        console.log(pot);
        const finalAssets = await getFinalAssets(this.randomSeed, this.iterations, utils.encode(pot), this.allAssets);
        this.canvasData.assets = this.addSourceItem(this.assetPacks, finalAssets);
        console.log('iteration: ' + this.iterations);
        let picked = [];
        for (let i = 0; i < this.canvasData.assets.length; i++) {
          picked.push(this.canvasData.assets[i].id);
        }
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
        console.log(this.randomHashIds);
        window.sessionStorage.setItem('randomHashIds', JSON.stringify(this.randomHashIds));
        window.sessionStorage.setItem('iterations', (this.iterations - 1).toString());
        window.sessionStorage.setItem('timestamp', this.timestamp);
        console.log(this);
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
                flex: 1;
                align-items: center;
                justify-content: center;

                .hero-text-content {
                    max-width: 300px;
                    margin: 0 auto;
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
            & > > > .button-wrapper {
                width: 100px;
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