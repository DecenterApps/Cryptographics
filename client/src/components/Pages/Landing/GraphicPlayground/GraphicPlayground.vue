<template>
    <div class="hero">
        <div class="container">
            <div class="left">
                <h2 class="large-title">Cryptographics</h2>
                <p>Create, store and trade randomly generated digital artwork on the blockchain.</p>
                <p>Artists upload their asset packs, making them available for Creators to buy and use. Creators generate random digital artwork with chosen asset packs and store them on the blockchain where they are signed as Creators forever, receiving a kickback for each future sale. Collectors can then pick their favourites and buy and trade Cryptographics in Ether.</p>
                <p>Cryptographics is a fully decentralized app (DApp) with no back-end server and each Cryptographic is one of a kind ERC721 token containing all image data.</p>
                <button-link to="/gallery">Gallery</button-link>
            </div>
            <div class="right">
                <div class="create-art">
                    <div class="button-group">
                        <cg-button @click="openInEditor">Open in editor</cg-button>
                        <cg-button
                                button-style="transparent"
                                @click="renderCanvas">
                            Recompose
                        </cg-button>
                    </div>
                    <div class="canvas-holder">
                        <overlay>
                            <button-icon icon-type="download" />
                        </overlay>
                        <div class="canvas-holder-wrapper">
                            <Canvas :canvasData="canvasData"></Canvas>
                        </div>
                    </div>
                </div>
                <div class="assets">
                    <img src="../assets/asset.png">
                    <img src="../assets/asset.png">
                    <img src="../assets/asset.png">
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
    generatePacks,
  } from 'services/ethereumService';
  import { getData, loadDataForAssets } from 'services/imageService';
  import * as utils from 'services/utils';
  import Gallery from 'shared/Gallery/Gallery.vue';
  import Canvas from 'pages/CreateGraphic/GraphicBuilder/Canvas';
  export default {
    name: 'GraphicPlayground',
    components: {
      Canvas,
      Gallery
    },
    data: () => ({
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
          assetPack.data.map(asset => parseInt(asset.id)))
          .reduce((a, b) => a.concat(b), []);
        console.log(pot);
        console.log('RANDOM SEED: ' + this.randomSeed);
        console.log('ITERATIONS: ' + this.iterations);
        console.log('TIMESTAMP: ' + this.timestamp);
        this.canvasData.assets = await getData(this.randomSeed, this.iterations, utils.encode(pot), this.allAssets);
        this.iterations++;
        console.log('iteration: ' + this.iterations);
        let picked = [];
        for (let i = 0; i < this.canvasData.assets.length; i++) {
          picked.push(this.canvasData.assets[i].id);
        }
      },
      openInEditor() {
        console.log(this.randomHashIds);
        window.sessionStorage.setItem('randomHashIds', JSON.stringify(this.randomHashIds));
        window.sessionStorage.setItem('iterations', (this.iterations - 1).toString());
        window.sessionStorage.setItem('timestamp', this.timestamp);
        console.log(this);
        this.$router.push('/create-graphic');
      },
    },
    async beforeCreate() {
      this.randomHashIds = pickTenRandoms();
      this.timestamp = new Date().getTime();
      this.iterations = 0;
      this.allAssets = await loadDataForAssets();
      this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
      this.randomSeed = await convertSeed(this.randomSeed);
      this.assetPacks = generatePacks();
      this.renderCanvas();
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
                p:last-of-type {
                    margin-bottom: 30px;
                }
            }
            .right {
                display: flex;
                justify-content: flex-end;
            }
            @media screen and (max-width: 1120px) {
                flex-direction: column;
                .left {
                    margin-bottom: 30px;
                    text-align: center;
                    p {
                        margin: 0 auto 16px;
                    }
                }
                .right {
                    flex-direction: column;
                    .create-art {
                        flex-direction: column-reverse;
                        align-items: center;
                        .button-group {
                            flex-direction: row;
                            align-items: center;
                            margin-bottom: 30px;
                            .button {
                                margin: 0 10px 0;
                            }
                        }
                        .canvas-wrapper {
                            margin: 20px 0;
                        }
                    }
                    .assets {
                        flex-direction: row;
                        justify-content: center;
                        img {
                            margin: 0 10px 0;
                        }
                    }
                }
            }
        }
        p {
            max-width: 320px;
        }
    }

    .create-art {
        display: flex;
        .button-group {
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            .button {
                margin-bottom: 20px;
                &:last-of-type {
                    margin: 0;
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

    .assets {
        display: flex;
        flex-direction: column;
        img {
            position: relative;
            margin-bottom: 30px;
        }
    }

    .artist-cta {
        background-color: #D9D9D9;
        padding: 70px 0;
        .container {
            width: 100%;
            max-width: 600px;
            text-align: center;
            p:last-of-type {
                margin-bottom: 30px;
            }
        }
    }

    .assets-slider {
        background-color: #D9D9D9;
        padding: 0 0 50px;
        .container {
            overflow: hidden;
            width: 100%;
            display: flex;
            .asset {
                position: relative;
                margin: 0 10px;
                &:hover {
                    .overlay {
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>