<template>
    <div class="gallery">
        <div class="container">
            <!-- <div v-if="displayFilters" class="filters">
                <div class="filter-group">
                    <span class="active">High</span>
                    <span>Low</span>
                    <span>Recent</span>
                </div>
                <div class="filter-group">
                    <span class="active">All</span>
                    <span>Select Asset Pack</span>
                </div>
            </div> -->
            <div class="masonry-wrapper"
                 v-masonry
                 transition-duration="0.3s"
                 item-selector=".item"
                 gutter=".gutter-sizer"
                 fit-width="true">
                <div class="grid">
                    <div class="gutter-sizer"></div>
                </div>
                <div v-masonry-tile class="item" v-for="(image, index) in images" :key="index">
                    <div class="artwork">
                        <router-link :to="`/single-graphic/${image.id}`">
                            <overlay v-if="displayOverlay">
                                <!--<button-icon icon-type="download"/>-->
                                <button-icon icon-type="zoom" />
                            </overlay>
                        </router-link>
                        <img v-bind:class="image.className" v-bind:src="image.src" alt="">
                    </div>
                    <div class="artwork-details">
                        <user-link :to="'/user/' + image.creator" :name="image.username" :avatar="image.avatar" />
                        <price
                                v-if="image.price"
                                :value="image.price"
                                size="small" />
                    </div>
                </div>
            </div>
            <button-link to="gallery">See more</button-link>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Gallery',
    props: {
      displayFilters: {
        type: Boolean,
        default: true
      },
      images: {
        type: Array,
        default: []
      },
      displayOverlay: {
        type: Boolean,
        default: false
      }
    },
  };
</script>

<style scoped lang="scss">
    .gallery {
        background-color: #EEEEEE;
        padding: 70px 0;
        min-height: 650px;
        text-align: center;
        .masonry-wrapper {
            width: 100%;
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
                /*padding: 14px 14px 40px 14px;*/
                background-color: #fff;
                position: relative;
                img {
                    max-width: 100%;
                }
                .artwork-description {
                    font-size: 5px;
                }
                &:hover {
                    .overlay {
                        opacity: 1;
                        cursor: pointer;
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
            }
        }
    }
</style>