<template>
    <div class="header-slider-wrapper">
        <div class="slider">
            <slick ref="slick" :options="slickOptions" @afterChange="handleAfterChange">
                <div class="slide" v-for="(slide, index) in slides" :key="index">
                    <div class="slide-bg" :style="'background-image: url(\'' + slide.image + '\')'"></div>
                    <div class="used-assets-wrapper">
                        <router-link
                                v-for="(ap, index) in slide.assetPacks"
                                :key="index"
                                class="asset-pack"
                                :to="'/asset-pack/' + ap.id"
                                :style="'background-image: url(\'' + ap.image + '\')'"
                        ></router-link>
                    </div>
                </div>
            </slick>
        </div>

        <div class="secondary-slider-container">
            <div class="text-slider" :class="{hide: isProfilePage}">
                <h3>Cryptographics are...</h3>
                <slick :options="textSliderOptions" ref="textSlider">
                    <h2 v-for="(word, index) in textSliderWords" :key="index">{{word}}</h2>
                </slick>
            </div>
        </div>
    </div>
</template>

<script>
  import Slick from 'vue-slick';

  export default {
    name: 'slider-gallery',
    components: {
      Slick,
    },
    data: () => ({
      slickOptions: {
        infinite: true,
        slidesToScroll: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 4000,
        centerMode: true,
        variableWidth: true,
        focusOnSelect: true,
      },
      textSliderOptions: {
        fade: true,
        draggable: false,
      },
      slides: [
        { image: '/assets/images/Slide 01.jpg', assetPacks: [{ image: '/assets/images/landing-ap-4.jpg', id: 4 }] },
        { image: '/assets/images/Slide 02.jpg', assetPacks: [{ image: '/assets/images/landing-ap-0.jpg', id: 0 }] },
        { image: '/assets/images/Slide 03.jpg', assetPacks: [{ image: '/assets/images/landing-ap-2.jpg', id: 2 }, { image: '/assets/images/landing-ap-5.jpg', id: 6 }] },
        { image: '/assets/images/Slide 04.jpg', assetPacks: [{ image: '/assets/images/landing-ap-3.jpg', id: 3 }] },
        { image: '/assets/images/Slide 05.jpg', assetPacks: [{ image: '/assets/images/landing-ap-1.jpg', id: 1 }] },
        { image: '/assets/images/Slide 06.jpg', assetPacks: [{ image: '/assets/images/landing-ap-0.jpg', id: 0 }, { image: '/assets/images/landing-ap-1.jpg', id: 1 }] },
        { image: '/assets/images/Slide 07.jpg', assetPacks: [{ image: '/assets/images/landing-ap-6.jpg', id: 6 }, { image: '/assets/images/landing-ap-4.jpg', id: 4 }] },
        { image: '/assets/images/Slide 08.jpg', assetPacks: [{ image: '/assets/images/landing-ap-6.jpg', id: 6 }, { image: '/assets/images/landing-ap-8.jpg', id: 8 }] },
        { image: '/assets/images/Slide 09.jpg', assetPacks: [{ image: '/assets/images/landing-ap-6.jpg', id: 6 }] },
      ],
      textSliderWords: [
        'inspiring', 'dramatic', 'unique', 'different', 'eternal', 'unconventional', 'striking',
      ].sort(() => 0.5 - Math.random()),
    }),
    computed: {
      isProfilePage: function () {
        return (this.$route.path === '/profile' || this.$route.path.indexOf('/user/') >= 0);
      },
    },
    methods: {
      handleAfterChange(event, slick, currentSlide) {
        this.$refs.textSlider.goTo(currentSlide)
      },
    }
  };
</script>

<style lang="scss">
    .header-slider-wrapper {
        background-color: #000;
        position: relative;

        .slider {
            width: 100%;
            height: 348px;
            margin: 0 auto;
            position: relative;
            overflow-y: hidden;

            @media all and (max-width: 1280px) {
                width: 100%;
            }

            .slick-slide {
                opacity: .5;
                outline: none;
                transition: opacity .2s;
                cursor: pointer;

                &:hover {
                    opacity: 1;
                }

                &.slick-active {
                    opacity: 1;
                    cursor: default;
                }
            }
            .slide {
                height: 348px;
                display: inline-block;
                width: 100%;
                position: relative;

                .slide-bg {
                    width: 1120px;
                    /*width: 100%;*/
                    height: 350px;
                    transition: opacity .2s;
                }

                .used-assets-wrapper {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: row-reverse;

                    .asset-pack {
                        height: 60px;
                        width: 90px;
                        margin-left: 20px;
                        display: inline-block;
                        background-size: cover;
                        background-position: 50%;
                        transition: all .2s;
                        opacity: 0;
                        transform: translateY(50%);
                        border: 3px solid white;
                    }
                }

            }

            .slick-active .slide:hover {
                .slide-bg {
                    opacity: .7;
                }

                .asset-pack {
                    opacity: 1;
                    transform: translateY(0%);
                    transition: all .3s;
                    transition-delay: .2s;
                    cursor: pointer;

                    &:first-child {
                        transition-delay: 0s;
                    }
                    &:nth-child(2) {
                        transition-delay: .05s;
                    }
                    &:nth-child(3) {
                        transition-delay: .1s;
                    }
                }
            }
        }

        .secondary-slider-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 1120px;
            margin: auto;
            height: 348px;
            pointer-events: none;
            overflow: hidden;

            .text-slider {
                background: black;
                width: 400px;
                height: 112px;
                left: 0;
                bottom: 0;
                position: absolute;
                color: white;
                font-family: "YoungSerif-Regular", sans-serif;
                padding: 26px 25px;
                transition: all .2s;
                &.hide {
                    transform: translateY(100%);
                    opacity: 0;
                }

                h3 {
                    font-size: 20px;
                }

                h2 {
                    font-size: 30px;
                    line-height: 1.6;
                }
            }
        }
    }
</style>