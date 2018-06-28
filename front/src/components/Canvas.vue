<template>
    <div class="canvas-wrapper">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
  import methods from '../methods';

  export default {
    data: () => ({}),
    props: ['canvasData'],
    watch: {
      canvasData: {
        handler:function (newData) {
          let canvas = document.getElementById('canvas');
          const rect = canvas.parentNode.getBoundingClientRect();
          const size = methods.getSize(rect.width, rect.height, this.canvasData.ratio);
          canvas.width = size.width;
          canvas.height = size.height;
          methods.makeImage(newData.assets, canvas, canvas.width, canvas.height);
        },
        deep: true,
      }
    },
    methods: {
      getCanvasElement() {
        return document.getElementById('canvas');
      },
    }
  };
</script>


<style lang="scss">
    .canvas-wrapper {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
    }
</style>