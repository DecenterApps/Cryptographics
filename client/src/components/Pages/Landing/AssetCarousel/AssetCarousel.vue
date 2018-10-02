<template>
    <div class="assets-slider">
        <!--<carousel :per-page="10" :paginationEnabled="false" :scroll-per-page="false" :autoplay-timeout="2000"-->
        <!--:mouse-drag="true" :autoplay="true" :loop="true" class="assets-slider">-->
        <slick ref="slick" :options="slickOptions">

            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-1.jpg"></router-link>
            </div>
            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-2.jpg"></router-link>
            </div>
            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-3.jpg"></router-link>
            </div>
            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-4.jpg"></router-link>
            </div>
            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-5.jpg"></router-link>
            </div>
            <div class="asset">
                <router-link to="/"><img src="./asset-packs/landing-ap-6.jpg"></router-link>
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
        slidesToScroll: 1,
        slidesToShow: 1,
        // centerMode: true,
        variableWidth: true,
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

<style lang="scss">
    .assets-slider {
        padding: 0 0 50px;
        .asset {
            margin: 0 10px;
            a {
                outline: none;
            }
            &:hover {
                .overlay {
                    opacity: 1;
                }
            }
        }
    }
</style>