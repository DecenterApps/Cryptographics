<template>
    <div class="canvas-wrapper" :class="{'square': this.canvasData.ratio === '1:1'}">
        <canvas fill="#fff" id="canvas"></canvas>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { TOGGLE_CANVAS_DRAWING } from 'store/canvas/types';
  import { getSize, makeImage } from 'services/imageService';

  export default {
    data: () => ({}),
    props: ['canvasData', 'frame', 'width', 'height'],
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
        align-items: flex-start;
        height: 100%;
        width: 100%;
        canvas {
            max-width: 100%;
            height: calc(100vh - 200px);
            @media screen and (max-width: 940px) {
                height: auto;
            }
        }
        &.square {
            canvas {
                max-height: 670px;
                @media screen and (max-width: 1120px) {
                    height: auto;
                }
            }
        }
    }
</style>