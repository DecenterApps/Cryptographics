<template>
    <div class="graphic-builder">
        <div class="left">
            <Canvas :canvasData="canvasData"></Canvas>
        </div>
        <div class="right">

            <div class="controls">
                <div class="top-controls">
                    <cg-checkbox v-on:checked="(val) => canvasData.frame = val">Add white frame</cg-checkbox>
                    <cg-checkbox v-on:checked="toggleRatio" :disabled="isCanvasDrawing">Use square format</cg-checkbox>
                    <cg-button
                            :loading="isCanvasDrawing"
                            @click="renderCanvas"
                            button-style="secondary">
                        Recompose
                    </cg-button>
                </div>
                <separator></separator>
                <div class="bottom-controls">
                    <cg-button
                            button-style="secondary"
                            @click="changeStep(0)"
                    >
                        Back
                    </cg-button>
                    <cg-button
                            :loading="isCanvasDrawing"
                            @click="changeStep(2)"
                    >
                        Next
                    </cg-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {
    pickTenRandoms,
    calculatePrice,
    calculateFirstSeed,
    convertSeed,
    getTestImage,
  } from 'services/ethereumService';
  import Canvas from '../../CreateGraphic/GraphicBuilder/Canvas.vue';
  import { resizeCanvas, shuffleArray, uniq } from 'services/helpers';
  import { mapGetters } from 'vuex';
  import { METAMASK_ADDRESS, USERNAME, BOUGHT_ASSETS_PACKS_IDS } from 'store/user-config/types';
  import { TOGGLE_MODAL, TOGGLE_LOADING_MODAL, CHANGE_LOADING_CONTENT, HIDE_LOADING_MODAL } from 'store/modal/types';
  import { CANVAS_DRAWING, SELECTED_ASSET_PACKS } from 'store/canvas/types';

  export default {
    name: 'TestAssetPack',
    components: {
      Canvas
    },
    props: {
      selectedAssets: {
        default: [],
      },
      changeStep: {
        default: () => {}
      },
      currentStep: {
        default: 0,
      }
    },
    data: () => ({
      canvasData: {
        assets: [],
        ratio: '2:3',
        frame: false,
        noBottomFrame: false,
      },
      randomSeed: 0,
      iterations: 0,
      timestamp: new Date().getTime(),
      randomHashIds: pickTenRandoms(),
    }),
    computed: {
      ...mapGetters({
        isCanvasDrawing: CANVAS_DRAWING,
      })
    },
    methods: {
      async renderCanvas() {
        this.iterations++;
        let selectedAssets = this.selectedAssets;
        selectedAssets = shuffleArray(selectedAssets);
        selectedAssets = selectedAssets.slice(0, 30);
        this.canvasData.assets = await getTestImage(this.randomSeed, this.iterations, selectedAssets);
        console.log('iteration: ' + this.iterations);
      },
      toggleRatio(square) {
        this.canvasData.ratio = square ? '1:1' : '2:3';
      },
    },
    async created() {
      this.randomHashIds = pickTenRandoms();
      this.iterations = 0;
      this.timestamp = new Date().getTime();
      this.randomSeed = await calculateFirstSeed(this.timestamp, this.randomHashIds);
      this.randomSeed = await convertSeed(this.randomSeed);
      this.renderCanvas();
    },
  };
</script>

<style scoped lang="scss">
    .graphic-builder {
        position: relative;
        display: flex;
        width: 100%;

        .left {
            flex-shrink: 1;
        }
        .right {
            display: flex;
            flex-flow: column;
            justify-content: flex-end;
            flex-grow: 1;
            margin-left: 50px;
            /*max-width: 400px;*/
            min-width: 300px;
            width: 100%;
        }
        @media screen and (max-width: 768px) {
            flex-direction: column;
            .left {
                margin-bottom: 30px;
                flex-grow: 1;
                width: 100%;
                display: flex;
                .canvas-wrapper {
                    flex: 1 0 100%;
                }
            }
            .right {
                margin: 0;
                flex-direction: column;
                align-items: stretch;
                max-width: none;
                .controls {
                    margin: 30px 0;
                    align-items: flex-start;
                    .asset-controls {
                        flex-direction: row;
                        align-items: center;
                        margin-bottom: 30px;
                        .selected-asset-packs {
                            margin-left: 30px;
                            .asset {
                                margin-top: 0;
                            }
                        }
                    }
                }
            }
        }
    }

    .controls {
        .asset-controls {
            margin-bottom: 100px;
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .top-controls {
            margin-bottom: 20px;

            button {
                margin-top: 10px;
            }

            .small-title {
                margin-bottom: 15px;
                margin-top: 10px;
            }

            &.buy-screen {
                /*display: flex;*/
                /*flex-direction: column;*/
                /*align-items: flex-end;*/
                margin-bottom: 0;

                input {
                    width: 185px;
                    margin-top: 20px;
                }
            }
        }
        .bottom-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 20px;

            span {
                margin-right: 17px;
                font-weight: bold;
            }

            button {
                min-width: 70px;
            }

            &.buy-screen {
                justify-content: space-between;

                .separate-controls {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;

                    button {
                        min-width: 135px;
                    }
                }
            }

            .large-title {
                margin: 0 15px 0 0;
            }
        }
    }
</style>