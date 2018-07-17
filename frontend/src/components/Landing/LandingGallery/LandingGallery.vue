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
                <div v-masonry-tile class="item" v-for="(item, index) in images" :key="index">
                    <div class="artwork">
                        <div class="overlay">
                            <button class="icon-button"><img src="./assets/ico-download.png"></button>
                            <button class="icon-button"><img src="./assets/ico-magnifier.png"></button>
                        </div>
                        <img v-bind:class="item.className" v-bind:src="item.src" alt="">
                    </div>
                    <div class="artwork-details">
                        <a href="" class="author">
                            <img class="avatar" src="" alt="">
                            <span class="username">@username</span>
                        </a>
                        <span class="price">0.45</span>
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
    background-color: #EEEEEE;
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
            position: relative;
            img {
                max-width: 100%;
            }
            .artwork-description {
                font-size: 5px;
            }
            .overlay {
                position: absolute;
                top: 0; right: 0; bottom: 0; left: 0;
                opacity: 0;
                background-color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity .2s ease-in-out;
                .icon-button {
                    margin: 0 20px;
                }
            }
            &:hover {
                .overlay {
                    opacity: .7;
                }
            }
        }
        .artwork-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            .author {
                display: flex;
                align-items: center;
                text-decoration: none;
                .avatar {
                    display: inline-flex;
                    background-color: #555;
                    border-radius: 50%;
                    width: 33px;
                    height: 33px;
                    margin-right: 10px;
                }
                .username {
                    color: #858585;
                    font-size: 12px;
                }
            }
            .price {
                font-size: 12px;
                font-weight: bold;
                &:after {
                    content: "";
                    width: 6px;
                    height: 7px;
                    margin-left: 5px;
                    display: inline-flex;
                    background-image: url(./assets/ico-eth-currency.png);
                }
            }
        }
    }
}
</style>