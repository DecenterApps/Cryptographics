<template>
    <div class="gallery">
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
                    <p class="artwork-title">{{ image.title }}</p>
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
        <div class="bottom-controls">
            <pagination
                    :total="imageIds === null ? 0 : imageIds.length"
                    :per-page="showPerPage"
                    @updatePage="changePage" />
        </div>
        <button-link button-style="primary see-more" v-if="seeMore" to="gallery">See more</button-link>
    </div>
</template>

<script>
  import {
    getImagesMetadata,
  } from 'services/ethereumService';
  import { paginateArray } from 'services/helpers';
  import { mapGetters } from 'vuex';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { ipfsNodePath } from 'config/constants';

  export default {
    name: 'PaginatedGallery',
    props: {
      showPerPage: {
        type: Number,
        default: 9
      },
      displayOverlay: {
        type: Boolean,
        default: false
      },
      imageIds: {
        type: Array,
        default: []
      },
      seeMore: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        ipfsNodePath,
        loading: false,
        images: [],
      };
    },
    computed: {
      ...mapGetters({
        metamaskAddress: METAMASK_ADDRESS,
      })
    },
    asyncComputed: {
      images: {
        async get() {
          this.loading = true;
          const selectedImages = paginateArray(this.imageIds, 1, this.showPerPage);
          const images = await getImagesMetadata(selectedImages);
          this.loading = false;
          return images;
        },
        watch() {
          this.metamaskAddress;
        }
      },
    },
    methods: {
      async changePage(currentPage) {
        this.loading = true;
        const selectedImages = paginateArray(this.imageIds, currentPage, this.showPerPage);
        this.images = await getImagesMetadata(selectedImages);
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
    .gallery {
        padding: 70px 0;
        .masonry-wrapper {
            /*width: 100% !important;*/
            margin: 0 auto;
        }
        .gutter-sizer {
            width: 97px;
            @media (max-width: 1280px) {
                width: 75px;
            }
        }
        .see-more {
            margin: 50px 0 80px 0;
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
                .artwork-title {
                    position: absolute;
                    left: 330px;
                    bottom: 0;
                    width: 100%;
                    transform: rotate(-90deg);
                    transform-origin: bottom left;
                    color: #858585;
                    font-size: 14px;
                    font-family: Roboto, sans-serif;
                    margin: 0;
                    text-align: left;
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