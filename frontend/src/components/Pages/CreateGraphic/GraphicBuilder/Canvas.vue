<template>
    <div class="canvas-wrapper">
        <canvas fill="#fff" id="canvas"></canvas>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { TOGGLE_CANVAS_DRAWING } from 'store/canvas/types';
  import { getSize, makeImage } from 'services/imageService';

  export default {
    data: () => ({}),
    props: ['canvasData', 'frame'],
    methods: {
      ...mapActions({
        toggleDrawing: TOGGLE_CANVAS_DRAWING,
      }),
      getCanvasElement() {
        return document.getElementById('canvas');
      },
    },
    computed: {
      ...mapState({
        isCanvasDrawing: ({ canvas }) => canvas.isCanvasDrawing,
      })
    },
    watch: {
      canvasData: {
        handler: async function (newData) {
          let canvas = document.getElementById('canvas');
          const rect = canvas.parentNode.getBoundingClientRect();
          const size = getSize(rect.width, rect.height, this.canvasData.ratio);
          const frame = this.canvasData.frame || false;
          canvas.width = size.width;
          canvas.height = size.height;
          const FRAME_BOUNDARIES = frame ? {
            left: size.width / 20,
            bottom: size.height / 6.3,
            right: size.width / 20,
            top: size.width / 20,
            ratio: this.canvasData.ratio
          } : undefined;
          this.toggleDrawing();
          await makeImage(newData.assets, canvas, canvas.width, canvas.height, FRAME_BOUNDARIES);
          console.log(1);
          this.toggleDrawing();
        },
        deep: true,
      }
    },
    mounted: function () {
      let canvas = document.getElementById('canvas');
      const rect = canvas.parentNode.getBoundingClientRect();
      const size = getSize(rect.width, rect.height, this.canvasData.ratio);
      const frame = this.canvasData.frame || false;
      canvas.width = size.width;
      canvas.height = size.height;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
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