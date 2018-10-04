<template>
    <div class="assets-slider">
        <slick ref="slick" :options="slickOptions">
            <div class="asset" v-for="i in [0, 1, 2, 3, 4, 5, 6, 8]">
                <router-link :to="`/asset-pack/${i}`"><img :src="`/assets/images/landing-ap-${i}.jpg`"></router-link>
            </div>
        </slick>
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