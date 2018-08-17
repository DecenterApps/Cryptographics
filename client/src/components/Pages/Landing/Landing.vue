<template>
    <div>
        <graphic-playground />
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
        const numOfImages = await getImageCount();
        const ids = [...Array(parseInt(numOfImages)).keys()];
        this.images = await getImagesMetadata(ids);
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
            .button-wrapper {
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
</style>