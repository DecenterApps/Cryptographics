<template>
    <div>
        <graphic-playground />
        <div class="fab">
            <button-link to="/create-graphic" button-style="primary">Compose</button-link>
        </div>
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
            <paginated-gallery :imageIds="imageIds" :display-filters="false" :display-overlay="true" :see-more="true" :show-per-page="12" />
        </div>
        <div class="landing-section inverted">
            <h1 class="section-title">Create</h1>
            <div class="title-section">
                <h1 class="large-title">Asset Pack</h1>
                <p class="wider">All visual artists are welcome to create and upload their asset packs.</p>
            </div>
            <div class="steps asset-packs">
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-1.png" alt="">
                    </div>
                    <p class="small-title">Assets</p>
                    <p>created by Artists</p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-2.png" alt="">
                    </div>
                    <p class="small-title">Asset Pack</p>
                    <p>All assets in one <br> Asset Pack</p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-3.png" alt="">
                    </div>
                    <p class="small-title">Cryptographic</p>
                    <p>created with users <br> Asset packs</p>
                </div>
            </div>
            <div class="steps-bottom-section">
                <svg width="322" height="101" viewBox="0 0 322 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M322 100.5H1V0.5H26" stroke="black"/>
                </svg>

                <p>Artists take <b>90%</b> of Cryptographic price</p>
                <svg width="338" height="102" viewBox="0 0 338 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M314 1H337V101.5H0" stroke="black"/>
                </svg>

            </div>
            <div class="container">
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
  import IcoArrowLong from '../../Shared/UI/Icons/IcoArrowLong';

  const toggleFab = (e) => {
    const scrollPos = window.pageYOffset;
    if (scrollPos > 0)
      document.querySelector('.fab').classList.add('shown');
    else
      document.querySelector('.fab').classList.remove('shown');
  };

  export default {
    name: 'Landing',
    components: {
      IcoArrowLong,
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
        let imageIds = [...Array(numOfImages).keys()].reverse();
        if (numOfImages > 12) imageIds = imageIds.slice(0, 12);
        this.imageIds = imageIds;
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry();
        }
      } catch (e) {
        console.log(e);
      }
      window.addEventListener('scroll', toggleFab);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', toggleFab);
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
    }

    .steps {
        display: flex;
        justify-content: center;

        .step {
            .image-wrapper {
                display: flex;
                align-items: center;
                height: 160px;
            }
            p {
                font-size: 15px;
                line-height: 19px;
                margin-top: 15px;
            }
        }

        &.asset-packs {
            .image-wrapper {
                height: 204px;
            }

            svg {
                position: relative;
                top: 170px;
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

    .steps-bottom-section {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: relative;
        top: -92px;

        p {
            margin: 0 22px !important;
            color: black !important;
        }
        svg {
            margin-bottom: 11px;
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
            user-select: none;
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
                max-width: 610px;
            }

            &.small-title {
                color: #000;
                font-weight: bold;
                font-family: YoungSerif-Regular;
                font-size: 21px;
                margin-top: 25px;
                margin-bottom: 10px;
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

    .fab {
        position: fixed;
        bottom: 40px;
        right: 40px;
        transform: translateX(200%);
        transition: all .2s;
        z-index: 200;
        @media screen and (max-width: 1200px) {
            bottom: 20px;
            right: 20px;
        }
        &.shown {
            transform: translateX(0%);
        }
        button {
            width: 64px;
            height: 64px;
            border-radius: 32px;
            display: block;
            padding: 0;
            font-size: 11px;
        }
    }
</style>