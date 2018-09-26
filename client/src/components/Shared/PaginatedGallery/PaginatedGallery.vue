<template>
    <div class="gallery">
        <div v-if="loading" class="loading-section">
            <loader />
            <h3>Please wait, loading Cryptographics from the blockchain.</h3>
        </div>
        <div v-if="!loading">
            <div v-if="images && images.length > 0">
                <div class="masonry-wrapper"
                     v-masonry
                     transition-duration="0s"
                     stutter="0"
                     item-selector=".item"
                     gutter=".gutter-sizer"
                     fit-width="true">
                    <div class="grid">
                        <div class="gutter-sizer"></div>
                    </div>
                    <div v-masonry-tile class="item" v-for="(image, index) in images" :key="index">
                        <div class="artwork">
                            <router-link :to="`/cryptographic/${image.id}`">
                                <overlay v-if="displayOverlay">
                                    <button-icon icon-type="zoom" />
                                </overlay>
                            </router-link>
                            <img v-bind:class="image.className" v-bind:src="image.src" alt="" width="307" :height="image.width === image.height ? '307':'434'">
                            <p class="artwork-title">{{ image.title }}</p>
                        </div>
                        <div class="artwork-details">
                            <user-link :to="'/user/' + image.owner" :name="image.username" :avatar="image.avatar" />
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

            <empty-state v-if="images && images.length === 0" :type="emptyStateType" />
        </div>
    </div>
</template>

<script>
  import {
    getGalleryImages,
  } from 'services/ethereumService';
  import { paginateArray } from 'services/helpers';
  import { mapGetters } from 'vuex';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { ipfsNodePath } from 'config/constants';
  import EmptyState from '../EmptyState/EmptyState';

  export default {
    name: 'PaginatedGallery',
    components: { EmptyState },
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
      },
      emptyStateType: {
        type: String,
        default: '',
      },
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
          const images = await getGalleryImages(selectedImages, true);
          this.loading = false;
          console.log(images);
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
        this.images = await getGalleryImages(selectedImages, true);
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
        .loading-section {
            width: 100%;
            height: 470px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #CECECE;
            margin-top: 30px;
            & .loader-content {
                margin-bottom: 20px;
            }
        }
    }
</style>