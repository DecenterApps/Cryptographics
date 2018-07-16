<template>
    <div class="landing-gallery">
        <div class="container">
            <div class="masonry-wrapper"
                 v-masonry transition-duration="0.3s"
                 item-selector=".item"
                 gutter=".gutter-sizer"
                 fit-width="true"
            >
                <div class="grid">
                    <div class="gutter-sizer"></div>
                </div>
                <div v-masonry-tile class="item" v-for="(item, index) in images">
                    <div class="artwork">
                        <img v-bind:class="item.className" v-bind:src="item.src" alt="">
                    </div>
                    <div class="artwork-details">
                        <a href="" class="artwork-author">
                            <img class="" src="" alt="">
                            <p>@username</p>
                        </a>
                        <p class="artwork-price">0.45</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'landing-gallery',
    props: ['displayFilters', 'images'],
  };
</script>

<style scoped lang="scss">
    .landing-gallery {
        background-color: #F9F9F9;
        padding: 70px 0;

        .masonry-wrapper {
            margin: 0 auto;
        }
        .gutter-sizer {
            width: 70px;
        }

        .filters {
            padding: 30px 0 70px 0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;

            span {
                margin-right: 14px;

                &.active {
                    text-decoration: underline;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        .item {
            width: 307px;
            margin-bottom: 30px;

            .artwork {
                padding: 14px 14px 40px 14px;
                background-color: #fff;

                img {
                    max-width: 100%;
                }

                .artwork-description {
                    font-size: 5px;
                }

                
            }
            .artwork-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .artwork-author {
                    display: flex;
                    align-items: center;
                    color: #858585;
                    font-size: 12px;
                    text-decoration: none;
                    img {
                        display: inline-flex;
                        background-color: #555;
                        border-radius: 50%;
                        width: 33px;
                        height: 33px;
                        margin-right: 10px;
                    }
                }
                .artwork-price {
                    font-size: 12px;
                    font-weight: bold;
                    &:after {
                        content: "";
                        width: 6px;
                        height: 7px;
                        margin-left: 5px;
                        display: inline-flex;
                        background-image: url(./assets/eth-ico.png);
                    }
                }
            }
            
        }
    }
</style>