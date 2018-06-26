<template>
    <div class="slider-wrapper">
        <div class="slider">
            <img src="./assets/image.png" alt="">
        </div>
    </div>
</template>

<script>
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
        }

        img {
            height: 100%;
            width: 100%;
        }
    }
</style>