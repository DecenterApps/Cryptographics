<template>
    <div class="gallery-page">
        <slider-gallery />

        <div class="container">
            <paginated-gallery :imageIds="imageIds" :display-overlay="true" />
        </div>
    </div>
</template>

<script>
  import PaginatedGallery from 'shared/PaginatedGallery/PaginatedGallery.vue';
  import { getImageCount } from 'services/ethereumService';

  export default {
    name: 'GalleryPage',
    components: {
      PaginatedGallery
    },
    data: () => ({
      imageIds: [],
    }),
    async created() {
      try {
        const numOfImages = parseInt(await getImageCount());
        this.imageIds = [...Array(parseInt(numOfImages)).keys()].reverse();
      } catch (e) {
        console.log(e);
      }
    }
  };
</script>

<style scoped>
    .gallery-page {
        background-color: #F9F9F9;
    }
</style>