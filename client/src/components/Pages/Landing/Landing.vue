<template>
    <div>
        <graphic-playground />
        <div class="fab">
            <button-link to="/create-cryptographic" button-style="primary">Compose</button-link>
        </div>
        <div class="stats-section">
            <div class="large-title">
                Cryptographics stats
            </div>
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">
                        {{ numOfCreators }}
                    </div>
                    <div class="stat-label">
                        Creators
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-number eth">
                        {{ totalEthEarned }}
                    </div>
                    <div class="stat-label">
                        Total ETH earned <br> by creators
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-number">
                        {{ numOfImages }}
                    </div>
                    <div class="stat-label">
                        Cryptographics
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-number">
                        {{ numOfAssetPacks }}
                    </div>
                    <div class="stat-label">
                        Asset packs
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-number">
                        {{ numOfAssets }}
                    </div>
                    <div class="stat-label">
                        Assets
                    </div>
                </div>
            </div>
        </div>
        <div class="landing-section how-it-works inverted">
            <h1 class="section-title">How</h1>
            <div class="title-section">
                <h1 class="large-title">It works</h1>
            </div>
            <div class="steps">
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-1.png" alt="">
                    </div>
                    <p class="small-title">Select <br> Asset packs</p>
                    <p class="secondary">
                        Random assets from the chosen packs will make it to your cryptographic.
                    </p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-2.png" alt="">
                    </div>
                    <p class="small-title">Generate a cryptographic</p>
                    <p class="secondary">
                        A provably random composition process creates your cryptographic.
                    </p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/step-3.png" alt="">
                    </div>
                    <p class="small-title">Claim <br> ownership</p>
                    <p class="secondary">
                        Saving your cryptographic lets you keep it forever or sell it in the Gallery
                    </p>
                </div>
            </div>
            <div class="container">
                <p class="steps-bottom">Each cryptographic is stored on the blockchain forever as a unique ERC-721
                    token.</p>
            </div>
        </div>
        <div class="landing-section create-asset-pack">
            <h1 class="section-title">Create</h1>
            <div class="title-section">
                <h1 class="large-title">Asset Packs</h1>
                <p class="wider">All visual artists are welcome to create and upload their asset packs.</p>
            </div>
            <div class="steps asset-packs">
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-1.png" alt="">
                    </div>
                    <p class="small-title">Design Assets</p>
                    <p class="secondary">Create unique graphical elements.</p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-2.png" alt="">
                    </div>
                    <p class="small-title">Create Asset Packs</p>
                    <p class="secondary">Group elements and upload them as Asset Packs.</p>
                </div>
                <ico-arrow-long></ico-arrow-long>
                <div class="step">
                    <div class="image-wrapper">
                        <img src="./assets/asset-pack-3.png" alt="">
                    </div>
                    <p class="small-title">Sell to Creators</p>
                    <p class="secondary">Offer your Asset Packs to Creators at your own price.</p>
                </div>
            </div>
            <div class="container">
                <br>
                <br>
                <p class="wider">
                    All visual artists are welcome to create and upload their asset packs.
                </p>
                <br>
                <br>
                <p class="wider">
                    Each asset pack can contain up to 50 different elements, at least one of which should be a
                    background graphic. Once the asset pack is uploaded and ready, you set your own price in Ether and
                    receive earnings every time a new Creator uses it.
                </p>
                <button-link button-style="primary thin-text" to="/create-asset-pack">Create asset pack
                </button-link>
                <br>
                <p class="wider">
                    Are you an Artist but not sure how to submit asset packs?<br>
                    Reach out and we'll help you out.
                </p>
                <button-link
                        button-style="primary-inverted thin-text"
                        to="/"
                        @click.native="openMail"
                >
                    Contact us
                </button-link>
            </div>
        </div>

        <div class="landing-section gallery-section inverted">
            <h1 class="section-title">
                Cryptographics
            </h1>
            <div class="title-section">
                <h1 class="large-title">Gallery</h1>
                <p>
                    The Gallery showcases all cryptographics that have been stored on the blockchain.
                    It’s the place where you can discover, buy and sell cryptographics.
                </p>
            </div>
            <paginated-gallery :imageIds="imageIds" :display-filters="false" :display-overlay="true" :see-more="true"
                               :show-per-page="12" centered />
        </div>
        <!--<asset-carousel />-->
    </div>
</template>

<script>
  import IcoArrow from 'shared/UI/Icons/IcoArrow';
  import AssetCarousel from './AssetCarousel/AssetCarousel';
  import GraphicPlayground from 'pages/Landing/GraphicPlayground/GraphicPlayground';
  import {
    getImageCount,
    getNumberOfAssetPacks,
    getNumberOfAssets,
    getCreatorCount,
    getAssetPackProfits,
    getSaleProfits,
  } from 'services/ethereumService';
  import PaginatedGallery from 'shared/PaginatedGallery/PaginatedGallery';
  import IcoArrowLong from '../../Shared/UI/Icons/IcoArrowLong';
  import { checkProvider } from '../../../services/helpers';

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
      numOfImages: 0,
      numOfAssetPacks: 0,
      numOfAssets: 0,
      numOfCreators: 0,
      totalEthEarned: 0,
    }),
    methods: {
      getData() {
        const profits = [getAssetPackProfits(), getSaleProfits()];
        Promise.all(profits)
          .then(([assetPackProfits, saleProfits]) => {
            this.totalEthEarned = (assetPackProfits + saleProfits).toFixed(2);
          }).catch(() => console.error);
        Promise.all([getNumberOfAssetPacks(), getNumberOfAssets(), getCreatorCount()])
          .then(([numOfAssetPacks, numOfAssets, numOfCreators]) => {
            this.numOfAssetPacks = numOfAssetPacks;
            this.numOfAssets = numOfAssets;
            this.numOfCreators = numOfCreators;
          }).catch(() => console.error);
      },
      openMail() {
        window.location.href = 'mailto:info@decenter.com';
      },
    },
    async created() {
      try {
        await this.getData();
        let numOfImages = parseInt(await getImageCount());
        this.numOfImages = numOfImages;
        let imageIds = [...Array(numOfImages).keys()].reverse();
        if (numOfImages > 12) imageIds = imageIds.slice(0, 12);
        this.imageIds = imageIds;
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry();
        }
      } catch (error) {
        console.error(error);
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

    .stats-section {
        background-color: #eeeeee;
        text-align: center;
        box-sizing: border-box;
        padding-top: 70px;
        padding-bottom: 250px;

        .stats {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: center;
            margin-top: 70px;

            .stat {
                margin-right: 60px;

                &:last-child {
                    margin-right: 0;
                }

            }

            .stat-number {
                position: relative;
                font-family: YoungSerif-Regular, sans-serif;
                font-size: 50px;
                color: #000000;

                &.eth::after {
                    content: 'ETH';
                    position: absolute;
                    right: -10px;
                    font-family: Roboto, sans-serif;
                    font-size: 21px;
                    color: #000000;
                    opacity: 0.3;
                }
            }

            .stat-label {
                margin-top: 20px;
                font-family: Roboto, sans-serif;
                font-size: 21px;
                color: #000000;
                opacity: 0.3;
            }
        }

        @media screen and (max-width: 768px) {
            & {
                padding-bottom: 100px;
            }

            .stats {
                .stat {
                    width: 100%;
                    margin-right: 0;
                    margin-top: 50px;
                    & .eth::after {
                        right: auto;
                        margin-left: 10px;
                    }
                }
            }

        }
    }

    .how-it-works {
        text-align: center;

        &.landing-section.inverted {
            padding-bottom: 200px;
        }
    }

    p {
        font-weight: 300;
    }

    .steps {
        display: flex;
        justify-content: center;
        @media screen and (max-width: 768px) {
            display: block;
        }

        .step {
            .image-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 160px;
            }
            p {
                line-height: 1.4em;
                margin: 15px auto 0;
                max-width: 210px;
                color: black;
                font-size: 16px;

                &.small-title {
                    color: #000;
                    font-weight: bold;
                    font-family: YoungSerif-Regular;
                    font-size: 21px;
                    margin-top: 25px;
                    margin-bottom: 10px;
                }

                &.secondary {
                    /*margin: 10px auto 0;*/
                    color: #717171;
                    font-size: 13px;
                    max-width: 180px;
                }
            }
        }

        &.asset-packs {
            .image-wrapper {
                height: 160px;
                & img {
                    width: 130px;
                }
            }

            svg {
                position: relative;
                top: 230px;
                // margin: 0 0px;
            }
        }

        svg {
            margin: 0 30px;
            position: relative;
            top: 200px;
            @media screen and (max-width: 768px) {
                display: none;
            }
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

    .steps-bottom {
        font-size: 15px;
        margin-top: 30px;
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
        background-color: #eeeeee;
        z-index: 1;
        text-align: center;

        &.gallery-section, &.create-asset-pack {
            padding-bottom: 100px;
        }

        &.inverted {
            background-color: #fff;
            padding-bottom: 40px;
            .section-title {
                color: #fff;
                pointer-events: none;
            }
        }
        .section-title {
            position: absolute;
            z-index: 0;
            // padding-top: 10px;
            top: -9.5vw;
            font-size: 11vw;
            // line-height: 160px;
            color: #eeeeee;
            font-family: YoungSerif-Regular, sans-serif;
            left: 50%;
            transform: translateX(-50%);
            user-select: none;
            max-width: 100vw;
            overflow: hidden;
        }

        p {
            line-height: 26px;
            font-size: 15px;
            color: #717171;
            max-width: 430px;
            margin: 0 auto;

            &.wider {
                max-width: 610px;
            }
        }

        .button {
            margin: 50px 0 50px 0;
            @media screen and (max-width: 768px) {
                display: none;
            }
        }

        .title-section {
            text-align: center;
            position: relative;
            top: -29px;
            margin-bottom: 20px;
            @media screen and (max-width: 768px) {
                top: 10px;
            }

            .large-title {
                margin-bottom: 40px;
            }
        }
        &.gallery-section {
            background-color: #d4d3d3;
            .section-title {
                color: #d4d3d3;
            }
        }
    }

    .artist-cta {
        background-color: #eeeeee;
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
        // @media screen and (max-width: 768px) {
        // display: none;
        // }
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
