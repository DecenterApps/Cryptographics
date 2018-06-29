<template>
    <div>
        <slider-gallery></slider-gallery>

        <div class="container">
            <div class="asset-packs-wrapper">
                <div v-for="(asset,key) in allAssetPaths">
                    <label> {{key}}</label>
                    <img :src=asset>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import SliderGallery from './SliderGallery/SliderGallery.vue';
  import MyAssets from './MyAssets.vue';

  export default {
    components: { MyAssets, SliderGallery },
    data: () => ({
      allAssetPaths: [],
    }),

    async created() {
      let assetDir = 'http://localhost:3000/dist/assets/';
      let len = 50;
      let images = [];
      for (let i = 1; i < len; i++) {
        if (i < 10) {
          let image = assetDir + '0' + i.toString() + '.png';
          images.push(image);
        } else {
          let image = assetDir + i.toString() + '.png';
          images.push(image);
        }
      }
      this.allAssetPaths = images;
    },
    computed: {},
    methods: {},
    render() {

    },
  };
</script>

<style scoped>
    img {
        margin-right: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 150px;
        height: 150px;
    }
    .asset-packs-wrapper {
        display: flex;
        flex-wrap: wrap;
    }
</style>