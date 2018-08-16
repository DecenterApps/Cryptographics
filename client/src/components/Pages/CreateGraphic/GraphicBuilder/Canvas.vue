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
      async drawCanvas(assets, delay) {
        let canvas = document.getElementById('canvas');
        const rect = canvas.parentNode.getBoundingClientRect();
        const size = getSize(rect.width, rect.height, this.canvasData.ratio);
        const frame = this.canvasData.frame || false;
        canvas.width = size.canvasWidth;
        canvas.height = size.canvasHeight;
        canvas.style.width = size.width + 'px';
        canvas.style.height = size.height + 'px';
        const FRAME_BOUNDARIES = {
          left: canvas.width / 20,
          bottom: canvas.height / 6.3,
          right: canvas.width / 20,
          top: canvas.width / 20,
          ratio: this.canvasData.ratio,
          shouldDrawFrame: frame,
        };
        this.toggleDrawing();
        try {
          await makeImage(assets, canvas, canvas.width, canvas.height, FRAME_BOUNDARIES, delay);
        } catch (e) {
          console.error(e);
          return this.toggleDrawing();
        }
        this.toggleDrawing();
      }
    },
    computed: {
      ...mapState({
        isCanvasDrawing: ({ canvas }) => canvas.isCanvasDrawing,
      })
    },
    watch: {
      canvasData: {
        handler: async function (newData) {
          this.drawCanvas(newData.assets, newData.delay);
        },
        deep: true,
      }
    },
    mounted: function () {
      this.drawCanvas(this.canvasData.assets, this.canvasData.delay);

      // window.addEventListener('resize', () => {
      //   // clear the timeout
      //   clearTimeout(timeout);
      //   // start timing for event "completion"
      //   timeout = setTimeout(() => {
      //     this.drawCanvas(this.canvasData.assets, 0);
      //   }, 500);
      //
      // });
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