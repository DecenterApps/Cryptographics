<template>
    <div>
        <div v-if="loading" class="loading-section">
            <loader />
        </div>
        <div v-if="assetPacks !== false && this.loading === false" class="assets-packs" :class="grid">
            <div
                    class="assets-pack"
                    v-if="assetPack"
                    v-for="(assetPack, index) in assetPacks"
                    :key="index">
                <!-- Without overlay -->
                <router-link
                        v-if="!overlay"
                        :to="'/asset-pack/' + assetPack.id">
                    <img class="image" :src="assetPack.packCoverSrc" />
                    <div class="description">
                        <div class="meta">
                            <span class="name">{{ assetPack.packName }}</span>
                        </div>
                    </div>
                </router-link>
                <!-- With overlay -->
                <template
                        v-if="overlay">
                    <img class="image" :src="assetPack.packCoverSrc" />
                    <router-link class="name" :to="'/asset-pack/' + assetPack.id">
                        <overlay>
                            <div class="meta">
                                <div class="top">
                                    <p class="name">{{ assetPack.packName }}</p>
                                    <user-link
                                            :to="'/user/' + assetPack.creator"
                                            :name="assetPack.username"
                                            :avatar="ipfsNodePath + assetPack.userAvatar"
                                            color="white" />
                                </div>
                                <div class="bottom">
                                    <price
                                            :value="assetPack.price"
                                            color="white"
                                            size="small" />
                                </div>
                            </div>
                        </overlay>
                    </router-link>
                </template>
            </div>
        </div>
        <pagination
                :total="assetPackIds === null ? 0 : assetPackIds.length"
                :per-page="showPerPage"
                @updatePage="changePage" />
        <div v-if="assetPackIds.length === 0" class="assets-packs">
            <p v-if="assetPacksType === 'created'">You haven't created any asset packs yet.</p>
            <p v-if="assetPacksType === 'bought'">You haven't bought any asset packs yet. Go to
                <router-link to="/assets-pack-market">market</router-link>
                .
            </p>
        </div>
    </div>
</template>

<script>
  import {
    getPackInformation,
  } from 'services/ethereumService';
  import { paginateArray } from 'services/helpers';
  import {
    METAMASK_ADDRESS,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
  } from 'store/user-config/types';
  import { ipfsNodePath } from 'config/constants';

  export default {
    name: 'AssetPacksPagination',
    props: {
      assetPacksType: {
        type: String,
        default: 'created'
      },
      showPerPage: {
        type: Number,
        default: 2
      },
      grid: {
        type: String,
        default: 'row-2'
      },
      overlay: {
        type: Boolean,
        default: false
      },
      assetPackIds: {
        type: Array,
        default: []
      },
    },
    data() {
      return {
        ipfsNodePath,
        loading: false,
      };
    },
    asyncComputed: {
      assetPacks: {
        async get() {
          this.loading = true;
          const selectedPacks = paginateArray(this.assetPackIds, 1, this.showPerPage);
          const assetPacks = await getPackInformation(selectedPacks);
          this.loading = false;
          return assetPacks;
        }
      },
    },
    methods: {
      async changePage(currentPage) {
        this.loading = true;
        const selectedPacks = paginateArray(this.assetPackIds, currentPage, this.showPerPage);
        this.assetPacks = await getPackInformation(selectedPacks);
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
    .assets-packs {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 30px;
        &.row-2 {
            .assets-pack {
                flex: 0 0 45%;
            }
        }
        &.row-4 {
            .assets-pack {
                flex: 0 0 23%;
            }
        }
        .assets-pack {
            position: relative;
            font-family: 'YoungSerif-Regular', sans-serif;
            font-size: 22px;
            margin-bottom: 20px;
            a {
                text-decoration: none;
                color: #000;
            }
            .image {
                width: 100%;
                height: auto;
            }
            .meta {
                padding: 10px 0;
            }
            &:hover {
                .overlay {
                    opacity: 1;
                }
            }
            .overlay {
                .meta {
                    position: relative;
                    z-index: 2;
                    height: 100%;
                    width: 100%;
                    padding: 15px !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .top {
                        /*display: flex;*/
                        /*flex-direction: column;*/
                        .name {
                            color: #fff;
                            font-size: 16px;
                            margin-bottom: 15px;
                        }
                    }
                    .bottom {
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
        .pagination-controls {
            flex: 0 0 100%;
        }
        @media screen and (max-width: 767px) {
            flex-direction: column;
        }
    }

    .loading-section {
        width: 100%;
        height: 470px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #CECECE;
        margin-top: 30px;
    }
</style>