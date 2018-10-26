<template>
    <div class="graphic-preview" @click="$emit('download')">
        <overlay v-if="!isFake">
            <button-icon icon-type="download" />
        </overlay>
        <overlay class="fake" v-if="isFake">
            <div class="fake-image">
                <img :src="errorIcon" alt="">
                <p>Warning: This cryptographic contains less than 30 assets, which is not a possible outcome according
                    to the Cryptographics algorithm. This most likely means that another user has found a way around the
                    predefined cryptographics composition rules. You should keep the dubious origin of this
                    cryptographic in mind in case you decide to buy it.</p>
            </div>
        </overlay>
        <Canvas
                :canvasData="canvasData"
                fill="#D9D9D9"
        ></Canvas>
    </div>
</template>

<script>
  import Canvas from '../CreateGraphic/GraphicBuilder/Canvas.vue';
  import errorIcon from 'assets/error-icon.png';

  export default {
    name: 'GraphicPreview',
    data: () => ({
      errorIcon
    }),
    props: {
      image: {
        type: Object,
      },
      isFake: {
        type: Boolean,
        default: false,
      },
      canvasData: {
        type: Object,
        default: {}
      }
    },
    components: { Canvas }
  };
</script>

<style scoped lang="scss">
    .graphic-preview {
        position: relative;
        margin: 0;
        background-color: #ffffff;
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        &:hover {
            .overlay {
                opacity: 1;
                cursor: pointer;
            }
        }

        .overlay.fake {
            opacity: 1;
            cursor: default;
            text-align: center;

            p {
                max-width: 60%;
                margin: 30px auto;
                font-family: Roboto, sans-serif;
                line-height: 18px;
                font-size: 12px;
            }
        }
        .image {
            max-width: 100%;
            max-height: calc(100vh - 200px);
        }
        .details {
            width: 100%;
            padding: 10px 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .title {
                text-align: center;
                .name {
                    font-size: 6px;
                    font-family: 'YoungSerif-Regular', serif;
                    display: block;
                }
                .address {
                    font-size: 4px;
                    display: block;
                }
            }
            .stamp {
                position: relative;
                display: inline-flex;
                transform: rotate(-11deg);
                .id {
                    font-family: 'YoungSerif-Regular', serif;
                    color: #FF3D00;
                    font-size: 7px;
                    position: absolute;
                    top: 33%;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .year {
                    font-size: 4px;
                    position: absolute;
                    bottom: 33%;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
</style>

