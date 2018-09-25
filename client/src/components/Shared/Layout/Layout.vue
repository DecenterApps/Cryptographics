<template>
    <div v-if="layoutStyle.indexOf('pulled-left') > -1" :class="['background-wrapper', layoutStyle]">
        <slider-gallery v-if="sliderGallery" />
        <div class="black-bg"></div>
        <div class="content-wrapper">
            <template v-if="layoutContent === 'no-container'">
                <slot />
            </template>
            <div v-else class="container">
                <slot />
            </div>
        </div>
    </div>
    <div v-else-if="layoutStyle.indexOf('full-width') > -1" :class="['background-wrapper', layoutStyle]">
        <slider-gallery v-if="sliderGallery" />
        <div class="black-bg"></div>
        <div class="content-wrapper">
            <template v-if="layoutContent === 'no-container'">
                <slot />
            </template>
            <div v-else class="container">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Layout',
    props: {
      layoutStyle: {
        type: String,
      },
      layoutContent: {
        type: String,
      },
      sliderGallery: {
        type: Boolean,
        default: false
      }

    }
  };
</script>

<style lang="scss" scoped>
    .background-wrapper {
        width: 100%;
        position: relative;
        .black-bg {
            position: absolute;
            top: 0;
            height: 350px;
            width: 100%;
            background-color: #000;
            margin: 0 auto;
            z-index: -1;
            overflow: hidden;
        }
        &.pulled-left {
            .content-wrapper {
                display: flex;
                min-height: calc(100vh - 69px);
                width: 100%;
                max-width: 1120px;
                margin: 0 auto;
                position: relative;
                background-color: #D9D9D9;
                &:before {
                    content: "";
                    background-color: #D9D9D9;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: -100%;
                    width: 100%;
                }
            }
        }
        &.full-width {
            .content-wrapper {
                width: 100%;
                position: relative;
                background-color: #EEEEEE;
                & .container {
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                }
            }
            &.gray-bg {
                .content-wrapper {
                    background-color: #D9D9D9;
                }
            }
        }
        .content-wrapper {
            display: flex;
            margin: 0 auto;
            position: relative;
            background-color: #D9D9D9;
            .container {
                padding: 35px 0;
                margin-right: 0;
                display: flex;
                & > .left {
                    display: inline-flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
                & > .right {
                    display: flex;
                    margin-left: 50px;
                    width: 100%;
                }
            }
            @media screen and (max-width: 1280px) {
                width: 100%;
                left: 0;
                .container {
                    width: 100%;
                    margin: 0 auto;
                    padding: 35px 20px;
                }
            }
            @media screen and (max-width: 767px) {
                .container {
                    flex-direction: column;
                    align-items: center;
                    & > .left {
                        margin-bottom: 60px;
                    }
                    & > .right {
                        margin-left: 0;
                        justify-content: center;
                    }
                }
            }
        }
    }
</style>
