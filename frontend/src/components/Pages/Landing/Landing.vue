<template>
    <div>
        <div class="hero">
            <div class="container">
                <div class="left">
                    <h2 class="large-title">Cryptographics</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                    <button-link to="/gallery">Gallery</button-link>
                </div>
                <div class="right">
                    <div class="create-art">
                        <div class="button-group">
                            <cg-button>Open in editor</cg-button>
                            <cg-button
                                button-style="transparent"
                                @click="renderCanvas">
                                Recompose
                            </cg-button>
                        </div>
                        <div class="canvas-wrapper">
                            <overlay><button-icon icon-type="download"/></overlay>
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
        <gallery :images="blocks" :display-filters="false" :display-overlay="true"/>
        <div class="artist-cta">
            <div class="container">
                <h3 class="large-title">Artist</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
                <button-link to="/upload-assets">Upload Assets Pack</button-link>
            </div>
        </div>
        <div class="assets-slider">
            <div class="container">
                <div v-for="i in 26" class="asset" :key="i">
                    <overlay><button-icon icon-type="zoom"/></overlay>
                    <img src="./assets/asset.png">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { makeCoverImage } from "../../../methods";
  import Gallery from '../../Shared/Gallery/Gallery.vue';

  export default {
    name: 'Landing',
    components: {
        Gallery
    },
    data: () => ({
      blocks: [
        {
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          price: 0.45,
          src: require('./assets/wide.png'),
        }, {
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          price: 0.45,
          src: require('./assets/wide.png'),
        }, {
          price: 0.45,
          src: require('./assets/long.png'),
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
.canvas-wrapper {
    position: relative;
    margin: 0 20px;
    padding: 30px 30px 0 30px;
    background-color: #ffffff;
    display: flex;
    max-width:440px;
    flex-direction: column;
    align-items: flex-start;
    &:hover {
        .overlay {
            opacity: 1;
        }
    }
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