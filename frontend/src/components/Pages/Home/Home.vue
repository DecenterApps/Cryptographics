<template>
    <div>
        <slider-gallery/>
        <gallery :images="blocks"/>
    </div>
</template>

<script>
  import Gallery from '../../Shared/Gallery/Gallery.vue';

  export default {
    name: 'about',
    components: {
      Gallery
    },
  };
</script>

<style scoped>
    canvas {
        margin-top: 20px;
        background-color: white;
        border: 1px solid blue;
        margin-left: 400px;
    }
    div.test-image {
        height: 561px;
        width: 400px;
        border: 1px solid black;
    }


</style>