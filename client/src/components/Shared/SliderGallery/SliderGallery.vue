<template>
    <div class="slider-wrapper">
        <div class="slider">
            <slick ref="slick" :options="slickOptions">
                <div><img src="./assets/Slide 01.png" alt=""></div>
                <div><img src="./assets/Slide 02.png" alt=""></div>
                <div><img src="./assets/Slide 03.png" alt=""></div>
                <div><img src="./assets/Slide 04.png" alt=""></div>
                <div><img src="./assets/Slide 05.png" alt=""></div>
            </slick>
        </div>
    </div>
</template>

<script>
  import Slick from 'vue-slick';

  export default {
    name: 'slider-gallery',
    components: {
      Slick,
    },
    data: () => ({
      slickOptions: {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 2000,
      },
    })
  };
</script>

<style scoped lang="scss">
    .slider-wrapper {
        background-color: #000;
        .slider {
            width: 1280px;
            height: 349px;
            margin: 0 auto;
            position: relative;
            left: -80px;
            overflow-y: hidden;

            @media all and (max-width: 1280px) {
                width: 100%;
            }
        }

        img {
            height: 100%;
            width: 100%;
        }
    }
</style>