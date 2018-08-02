<template>
    <div>
        <graphic-playground />
        <gallery :images="blocks" :display-filters="false" :display-overlay="true" />
        <div class="artist-cta">
            <div class="container">
                <h3 class="large-title">Artist</h3>
                <p>All visual artists are welcome to create and upload their asset packs.</p>
                <p>Each asset pack can contain up to 50 different graphic elements, one of which always needs to be a background graphic. Once the asset pack is uploaded and ready, you set your own price in Ether and receive earnings every time a new Creator uses it.</p>
                <button-link to="/upload-asset-pack">Upload Assets Pack</button-link>
            </div>
        </div>
        <div class="assets-slider">
            <div class="container">
                <div v-for="i in 26" class="asset" :key="i">
                    <overlay>
                        <button-icon icon-type="zoom" />
                    </overlay>
                    <img src="./assets/asset.png">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Gallery from 'shared/Gallery/Gallery.vue';
  import GraphicPlayground from 'pages/Landing/GraphicPlayground/GraphicPlayground';

  export default {
    name: 'Landing',
    components: {
      GraphicPlayground,
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
  };
</script>

<style scoped lang="scss">
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