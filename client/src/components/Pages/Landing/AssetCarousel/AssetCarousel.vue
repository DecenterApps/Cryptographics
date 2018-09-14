<template>
    <div class="assets-slider">
        <!--<carousel :per-page="10" :paginationEnabled="false" :scroll-per-page="false" :autoplay-timeout="2000"-->
                  <!--:mouse-drag="true" :autoplay="true" :loop="true" class="assets-slider">-->
        <slick ref="slick" :options="slickOptions">
            <div v-for="i in 30" class="asset" :key="i">
                <!--<overlay>-->
                <!--<button-icon icon-type="zoom" />-->
                <!--</overlay>-->
                <img src="../assets/asset.png">
            </div>
        </slick>
        <!--</carousel>-->
    </div>
</template>

<script>
  import Slick from 'vue-slick';

  export default {
    name: 'AssetCarousel',
    components: {
      Slick
    },
    data: () => ({
      images: [],
      slickOptions: {
        infinite: true,
        slidesToShow: 10,
        slidesToScroll: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: true,
      },
    }),
    async created() {
    }
  };
</script>

<style scoped lang="scss">
    .assets-slider {
        padding: 0 0 50px;
        .asset {
            margin: 0 10px;
            &:hover {
                .overlay {
                    opacity: 1;
                }
            }
        }
    }
</style>