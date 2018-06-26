<template>
    <div>
        <slider-gallery></slider-gallery>
        <home-gallery></home-gallery>
        <Footer></Footer>
    </div>
</template>

<script>
  import SliderGallery from '../SliderGallery/SliderGallery.vue';
  import HomeGallery from './HomeGallery/HomeGallery.vue';
  import Footer from '../Footer/Footer.vue';

  export default {
    name: 'about',
    components: {
      SliderGallery,
      Footer,
      HomeGallery,
    }
  };
</script>

<style scoped>

</style>