<template>
    <div class="slider-wrapper">
        <div class="slider">
            <carousel :per-page="1" :paginationEnabled="false" :scroll-per-page="true" :autoplay-timeout="2000"
                      :mouse-drag="true" :autoplay="true" :loop="true">
                <slide><img src="./assets/Slide 01.png" alt=""></slide>
                <slide><img src="./assets/Slide 02.png" alt=""></slide>
                <slide><img src="./assets/Slide 03.png" alt=""></slide>
                <slide><img src="./assets/Slide 04.png" alt=""></slide>
                <slide><img src="./assets/Slide 05.png" alt=""></slide>
            </carousel>
        </div>
    </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel';
  export default {
    name: 'slider-gallery'
  };
</script>

<style scoped lang="scss">
    .slider-wrapper {
        background-color: #000;
        .slider {
            width: 1280px;
            height: 350px;
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