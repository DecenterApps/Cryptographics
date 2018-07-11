<template>
    <div>
        <div>
            <canvas></canvas>
        </div>
        <slider-gallery></slider-gallery>
        <home-gallery :displayFilters="true" :images="blocks"></home-gallery>
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
    },
    data: () => ({
      blocks: [
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./HomeGallery/assets/wide.png'),
        },
      ],
    })
  };
</script>

<style scoped>

</style>