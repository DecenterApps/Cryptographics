<template>
    <div>
        <graphic-playground />
        <div class="how-it-works">
            <p class="large-title">How it Works</p>
            <div class="steps">
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-1.png" alt="">
                    </div>
                    <p>1. Select <br> Asset pack</p>
                </div>
                <ico-arrow></ico-arrow>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-2.png" alt="">
                    </div>
                    <p>2. Generate <br> Cryptographic</p>
                </div>
                <ico-arrow></ico-arrow>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-3.png" alt="">
                    </div>
                    <p>3. Sell it on <br> market</p>
                </div>
            </div>
        </div>
        <div class="landing-section">
            <h1 class="section-title">
                Cryptographics
            </h1>
            <div class="title-section">
                <h1 class="large-title">Gallery</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
            </div>
            <paginated-gallery :imageIds="imageIds" :display-filters="false" :display-overlay="true" :see-more="true" />
        </div>
        <div class="landing-section inverted">
            <h1 class="section-title">Create</h1>
            <div class="title-section">
                <h1 class="large-title">Asset Pack</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
            </div>
            <div class="container">
                <p class="wider">All visual artists are welcome to create and upload their asset packs.</p>
                <br>
                <br>
                <p class="wider">Each asset pack can contain up to 50 different graphic elements, one of which always
                    needs to be a
                    background graphic. Once the asset pack is uploaded and ready, you set your own price in Ether and
                    receive earnings every time a new Creator uses it.</p>
                <button-link to="/upload-asset-pack">Create asset pack</button-link>
            </div>
        </div>
        <asset-carousel />
    </div>
</template>

<script>
  import IcoArrow from 'shared/UI/Icons/IcoArrow';
  import AssetCarousel from './AssetCarousel/AssetCarousel';
  import GraphicPlayground from 'pages/Landing/GraphicPlayground/GraphicPlayground';
  import { getImagesMetadata, getImageCount } from 'services/ethereumService';
  import PaginatedGallery from 'shared/PaginatedGallery/PaginatedGallery';

  export default {
    name: 'Landing',
    components: {
      PaginatedGallery,
      AssetCarousel,
      GraphicPlayground,
      IcoArrow
    },
    data: () => ({
      imageIds: [],
    }),
    async created() {
      try {
        let numOfImages = parseInt(await getImageCount());
        if (numOfImages > 6) numOfImages = 6;
        this.imageIds = [...Array(numOfImages).keys()].reverse();
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
</script>

<style scoped lang="scss">
    .create-art {
        display: flex;
        .button-group {
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            button {
                margin-bottom: 20px;
                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }

    .gallery {
        padding-top: 50px;
    }

    .assets {
        display: flex;
        flex-direction: column;
        img {
            position: relative;
            margin-bottom: 30px;
        }
    }

    .large-title {
        color: #000;
    }

    .how-it-works {
        padding-top: 70px;
        padding-bottom: 200px;
        text-align: center;

        .steps {
            display: flex;
            justify-content: center;

            p {
                font-size: 15px;
                line-height: 19px;
                color: #000;
                margin-top: 15px;
            }

            .step {
                .image-wrapper {
                    display: flex;
                    align-items: center;
                    height: 160px;
                }
            }

            svg {
                margin: 60px 50px;
            }

            .step::after {
                display: block;
                content: ' ';
                background: url("./assets/arrow.svg");
                background-size: 18px 34px;
                height: 34px;
                width: 18px;
            }
        }
    }

    .landing-section {
        position: relative;
        background-color: #d9d9d9;
        z-index: 1;
        text-align: center;

        &.inverted {
            background-color: #fff;

            .section-title {
                color: #fff;
            }

            .section-title {
                margin-left: -263px;
            }
        }
        .section-title {
            position: absolute;
            z-index: 0;
            top: -135px;
            font-size: 160px;
            line-height: 160px;
            color: #d9d9d9;
            font-family: YoungSerif-Regular, sans-serif;
            left: 50%;
            margin-left: -622px;
        }

        p {
            font-family: Roboto, sans-serif;
            font-weight: 300;
            line-height: 26px;
            font-size: 15px;
            color: #717171;
            max-width: 430px;
            margin: 0 auto;

            &.wider {
                max-width: 590px;
            }
        }

        .button {
            margin: 70px 0 100px 0;
        }

        .title-section {
            text-align: center;
            position: relative;
            top: -29px;

            .large-title {
                margin-bottom: 40px;
            }
        }
    }

    .artist-cta {
        background-color: #D9D9D9;
        padding: 70px 0;
        .container {
            width: 100%;
            max-width: 600px;
            text-align: center;
            p:last-of-type {
                margin-bottom: 30px;
            }
        }
    }
</style>