<template>
    <div class="graphic-preview" @click="$emit('download')">
        <div v-if="isFake">FAKE</div>
        <overlay>
            <button-icon icon-type="download"/>
        </overlay>
        <img
                class="image"
                :src="image.src"
        >
    </div>
</template>

<script>
  export default {
    name: 'Graphic',
    props: {
      image: {
        type: Object,
      },
      isFake: {
        type: Boolean,
        default: false,
      }
    }
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

