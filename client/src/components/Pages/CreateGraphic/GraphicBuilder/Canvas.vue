<template>
    <div class="canvas-wrapper" :class="{'square': this.canvasData.ratio === '1:1'}">
        <canvas :fill="fill" id="canvas"></canvas>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { START_CANVAS_DRAWING, FINISH_CANVAS_DRAWING } from 'store/canvas/types';
  import { getSize, makeImage } from 'services/imageService';

  export default {
    data: () => ({}),
    props: {
      canvasData: {
        type: Object,
      },
      fill: {
        default: '#fff',
      }
    },
    methods: {
      ...mapActions({
        startDrawing: START_CANVAS_DRAWING,
        finishDrawing: FINISH_CANVAS_DRAWING,
      }),
      getCanvasElement() {
        return document.getElementById('canvas');
      },
      async drawCanvas(assets, delay) {
        let canvas = document.getElementById('canvas');
        const rect = canvas.parentNode.getBoundingClientRect();
        const size = getSize(rect.width, rect.height, this.canvasData.ratio);
        const frame = this.canvasData.frame || false;
        const finalFrameData = this.canvasData.finalFrameData || false;
        canvas.width = size.canvasWidth;
        canvas.height = size.canvasHeight;
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
        const BORDER_WIDTH = 125;
        const FRAME_BOUNDARIES = {
          left: BORDER_WIDTH,
          bottom: 460,
          right: BORDER_WIDTH,
          top: BORDER_WIDTH,
          ratio: this.canvasData.ratio,
          shouldDrawFrame: frame,
          finalFrameData,
        };
        this.startDrawing();
        try {
          await makeImage(assets, canvas, canvas.width, canvas.height, FRAME_BOUNDARIES, delay);
        } catch (e) {
          console.error(e);
          return this.finishDrawing();
        }
        if (assets.length > 0) this.$emit('canvasDrawn');
        this.finishDrawing();
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
        align-items: flex-start;
        height: 100%;
        width: 100%;
        canvas {
            /*max-width: 100%;*/
            height: calc(100vh - 145px);
            @media screen and (max-width: 767px) {
                height: auto;
                max-height: none;
                width: 100%;
            }
            max-height: 810px;
        }
        &.square {
            canvas {
                max-height: 670px;
                /*@media screen and (max-width: 1120px) {*/
                /*height: auto;*/
                /*}*/
            }
        }
    }
</style>