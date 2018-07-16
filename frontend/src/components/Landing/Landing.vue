<template>
    <div>
        <div class="hero">
            <div class="container">
                <div class="left">
                    <h2 class="large-title">Cryptographics</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                    <router-link to="/gallery" class="default-button button-negative">Gallery</router-link>
                </div>
                <div class="right">
                    <div class="create-art">
                        <div class="button-group">
                            <button class="default-button button-negative">Open in editor</button>
                            <button
                                class="default-button no-background"
                                @click="renderCanvas">Recompose</button>
                        </div>
                        <div class="canvas-wrapper">
                            <canvas id="canvas"></canvas>
                            <img class="cg-stamp" src="./assets/cg-stamp.png">
                        </div>
                    </div>
                    <div class="assets">
                        <img src="./assets/asset.png">
                        <img src="./assets/asset.png">
                        <img src="./assets/asset.png">
                    </div>
                </div>
            </div>
        </div>
        <landing-gallery :displayFilters="true" :images="blocks"></landing-gallery>
        <div class="artist-cta">
            <div class="container">
                <h3 class="large-title">Artist</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                <button class="default-button button-negative">Upload Assets Pack</button>
            </div>
        </div>
        <div class="assets-slider">
            <div class="container">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
                <img src="./assets/asset.png">
            </div>
        </div>
        <PageFooter></PageFooter>
    </div>
</template>

<script>
  import PageFooter from '../Footer/Footer.vue';
  import {makeCoverImage} from "../../methods";
  import LandingGallery from './LandingGallery/LandingGallery.vue';

  export default {
    name: 'Landing',
    components: {
        LandingGallery,
        PageFooter
    },
    data: () => ({
      blocks: [
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./LandingGallery/assets/long.png'),
        }
      ],
    }),
    methods: {
        renderCanvas() {
            let canvas = document.getElementById('canvas');
            canvas.width = 350;
            canvas.height = 350;

            let images_paths = [];
            let numberOfImages = Math.floor(Math.random() * 20);
            for(let i=0; i<numberOfImages; i++) {
                let val = Math.floor(Math.random()*30);
                if(val == 0) {
                    val = 1;
                }
                let path = val < 10 ? "0" + val.toString() : val.toString();
                images_paths.push(path);
            }
            makeCoverImage(true, images_paths, canvas, 350,350);
        }
    },
  };
</script>

<style scoped lang="scss">
p {
    color: #717171;
    font-size: 12px;
    line-height: 19px;
    letter-spacing: .5px;
    margin-bottom: 16px;
}

.default-button {
    background-color: #fff;
    color: #000;
    border-radius: 5px;
    outline: 0;
    border: 1px solid #000;
    width: auto;
    height: auto;
    cursor: pointer;
    display: inline-flex;
    padding: 9px 20px;
    font-size: 12px;
    border-radius: 5px;
    text-decoration: none;
    white-space: nowrap;
}

.default-button.button-negative {
    color: #fff;
    background-color: #000;
}

.default-button.no-background {
    background: none;
    border: 1px solid #000;
    width: auto;
    padding: 9px 20px;
}

.hero {
    background-color: #D9D9D9;
    padding: 45px 0;
    .container {
        width: 100%;
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

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
                        .default-button {
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
    .large-title {
        margin-bottom: 30px;
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
        .default-button {
            margin-bottom: 20px;
            &:last-of-type {
                margin: 0;
            }
        }
    }
}
.canvas-wrapper {
    margin: 0 20px;
    padding: 30px 30px 0 30px;
    background-color: #ffffff;
    display: flex;
    max-width:440px;
    flex-direction: column;
    align-items: flex-start;
    canvas {
        background-color: white;
        width: 100%;
        max-width:400px;
        min-width: 350px;
        height: 360px;
    }
    .cg-stamp {
        padding: 20px 0;
    }
}
.assets {
    display: flex;
    flex-direction: column;
    img {
        margin-bottom: 30px;
    }
}

.artist-cta {
    background-color: #D9D9D9;
    .container {
        width: 100%;
        max-width: 600px;
        text-align: center;
        padding: 70px 0;
        .large-title {
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
        img {
            margin: 0 10px;
        }
    }
}
</style>