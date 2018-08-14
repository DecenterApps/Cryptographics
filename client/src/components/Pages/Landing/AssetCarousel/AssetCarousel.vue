<template>
    <div class="assets-slider">
        <carousel :per-page="10" :paginationEnabled="false" :scroll-per-page="false" :autoplay-timeout="2000"
                  :mouse-drag="true" :autoplay="true" :loop="true" class="assets-slider">
            <slide v-for="i in 30" class="asset" :key="i">
                <!--<overlay>-->
                <!--<button-icon icon-type="zoom" />-->
                <!--</overlay>-->
                <img src="../assets/asset.png">
            </slide>
        </carousel>
    </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel';

  export default {
    name: 'AssetCarousel',
    components: {
      Carousel
    },
    data: () => ({
      images: [],
    }),
    async created() {
    }
  };
</script>

<style scoped lang="scss">
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