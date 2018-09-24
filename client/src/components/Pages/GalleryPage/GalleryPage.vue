<template>
    <div class="gallery-page">
        <div class="container">
            <div class="gallery-page-header">
                <h1 class="large-title">Gallery</h1>
                <button-link to="/create-graphic">Compose</button-link>
            </div>
            <separator />
            <div>
                <div class="button-group">
                    <cg-button
                            :button-style="showGraphics === 'all' ? 'tab-active' : 'tab-inactive'"
                            @click="showGraphics = 'all'">
                        All
                    </cg-button>
                    <cg-button
                            :button-style="showGraphics === 'sale' ? 'tab-active' : 'tab-inactive'"
                            @click="showGraphics = 'sale'">
                        For sale
                    </cg-button>
                </div>
                <paginated-gallery :emptyStateType="`gallery-${showGraphics}`" :imageIds="showGraphics === 'all' ? imageIds : imagesOnSale" :display-overlay="true" />
            </div>
        </div>
    </div>
</template>

<script>
  import PaginatedGallery from 'shared/PaginatedGallery/PaginatedGallery.vue';
  import { getImageCount, getImagesOnSale } from 'services/ethereumService';

  export default {
    name: 'GalleryPage',
    components: {
      PaginatedGallery
    },
    data: () => ({
      imageIds: [],
      imagesOnSale: [],
      showGraphics: 'all',
    }),
    async created() {
      try {
        const numOfImages = parseInt(await getImageCount());
        this.imageIds = [...Array(parseInt(numOfImages)).keys()].reverse();
        this.imagesOnSale = (await getImagesOnSale())[0];
      } catch (e) {
        console.log(e);
      }
    }
  };
</script>

<style scoped lang="scss">
    .gallery-page {
        background-color: #F9F9F9;
    }

    .gallery-page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 0;

        .large-title {
            margin: 0;
        }
    }

    .line-separator {
        margin-bottom: 30px;
    }

    .gallery {
        padding-top: 30px;
    }
</style>