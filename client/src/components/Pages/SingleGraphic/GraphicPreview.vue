<template>
    <div class="graphic-preview">
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
        .image {
            max-height: 500px;
            max-width: 500px;
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

