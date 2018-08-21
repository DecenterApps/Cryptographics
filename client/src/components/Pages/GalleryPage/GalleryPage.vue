<template>
    <div>
        <slider-gallery />
        <gallery :images="images" :display-overlay="true" />
    </div>
</template>

<script>
  import Gallery from 'shared/Gallery/Gallery.vue';
  import { getImagesMetadata, getImageCount } from 'services/ethereumService';

  export default {
    name: 'about',
    components: {
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

<style scoped>
    div.test-image {
        height: 561px;
        width: 400px;
        border: 1px solid black;
    }


</style>