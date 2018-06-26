<template>
    <div>
        <slider-gallery></slider-gallery>
        <Footer></Footer>
    </div>
</template>

<script>
  import SliderGallery from '../SliderGallery/SliderGallery.vue';
  import Footer from '../Footer/Footer.vue';

  export default {
    name: 'about',
    components: {
      SliderGallery,
      Footer,
    }
  };
</script>

<style scoped>

</style>