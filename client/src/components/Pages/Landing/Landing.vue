<template>
    <div>
        <graphic-playground />
        <div class="title-section">
            <h1 class="large-title">Gallery</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
        </div>
        <gallery :images="images" :display-filters="false" :display-overlay="true" />
        <div class="artist-cta">
            <div class="container">
                <h3 class="large-title">Artist</h3>
                <p>All visual artists are welcome to create and upload their asset packs.</p>
                <p>Each asset pack can contain up to 50 different graphic elements, one of which always needs to be a
                    background graphic. Once the asset pack is uploaded and ready, you set your own price in Ether and
                    receive earnings every time a new Creator uses it.</p>
                <button-link to="/upload-asset-pack">Upload Assets Pack</button-link>
            </div>
        </div>
        <asset-carousel />
    </div>
</template>

<script>
  import AssetCarousel from './AssetCarousel/AssetCarousel';
  import Gallery from 'shared/Gallery/Gallery.vue';
  import GraphicPlayground from 'pages/Landing/GraphicPlayground/GraphicPlayground';
  import { getImagesMetadata, getImageCount } from 'services/ethereumService';

  export default {
    name: 'Landing',
    components: {
      AssetCarousel,
      GraphicPlayground,
      Gallery
    },
    data: () => ({
      images: [],
    }),
    async created() {
      try {
        let numOfImages = parseInt(await getImageCount());
        if (numOfImages > 6) numOfImages = 6;
        const ids = [...Array(numOfImages).keys()].reverse();
        console.log(ids, numOfImages);
        this.images = await getImagesMetadata(ids, true);
        console.log(this.$redrawVueMasonry);
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
</script>

<style scoped lang="scss">
    .create-art {
        display: flex;
        .button-group {
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            button {
                margin-bottom: 20px;
                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }

    .gallery {
        padding-top: 50px;
    }

    .title-section {
        background-color: #EEEEEE;
        text-align: center;
        padding-top: 60px;
        padding-bottom: 10px;
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
</style>