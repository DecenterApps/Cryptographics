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
                    <img class="image" :src="ipfsNodePath + assetPack.packCover" />
                    <div class="description">
                        <div class="meta">
                            <span class="name">{{ assetPack.name }}</span>
                        </div>
                    </div>
                </router-link>
                <!-- With overlay -->
                <template
                        v-if="overlay">
                    <img class="image" :src="ipfsNodePath + assetPack.packCover" />
                    <overlay>
                        <div class="meta">
                            <div class="top">
                                <router-link class="name" :to="'/asset-pack/' + assetPack.id">{{ assetPack.name }}
                                </router-link>
                                <user-link
                                        :to="'/user/' + assetPack.userAddress"
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
                </template>
            </div>
        </div>
        <pagination
                :total="assetsLength === null ? 0 : assetsLength"
                :per-page="showPerPage"
                @updatePage="changePage" />
        <div v-if="assetPacks === false" class="assets-packs">
            <p v-if="assetsPackType === 'created'">You haven't created any assets pack yet.</p>
            <p v-if="assetsPackType === 'bought'">You haven't bought any assets pack yet. Go to
                <router-link to="/assets-pack-market">market</router-link>
                .
            </p>
        </div>
    </div>
</template>

<script>
  import {
    getPackInformation,
    getNumberOfAssetPacks,
    getAllAssetsPacksInfo
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
    name: 'AssetPacksPagination',
    props: {
      assetsPackType: {
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
      }
    },
    data() {
      return {
        ipfsNodePath,
        loading: false,
      };
    },
    computed: {
      ...mapGetters({
        metamaskAddress: METAMASK_ADDRESS,
        createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS
      })
    },
    asyncComputed: {
      assetPacks: {
        async get() {
          let pageAssetPacksIds;
          let packsInfo;
          this.loading = true;
          if (this.assetsPackType === 'created') {
            pageAssetPacksIds = paginateArray(this.createdPacksIDs, 1, this.showPerPage);
            packsInfo = await getPackInformation(pageAssetPacksIds, this.metamaskAddress);
          } else if (this.assetsPackType === 'bought') {
            pageAssetPacksIds = paginateArray(this.boughtPacksIDs, 1, this.showPerPage);
            packsInfo = await getPackInformation(pageAssetPacksIds, this.metamaskAddress);
          } else if (this.assetsPackType === 'all') {
            pageAssetPacksIds = await getAllAssetsPacksInfo();
            packsInfo = paginateArray(pageAssetPacksIds, 1, this.showPerPage);
          }
          let assetPacks = [];
          if (pageAssetPacksIds.length === 0) {
            assetPacks = false;
          } else {
            for (let i = 0; i < this.showPerPage; i++) {
              assetPacks.push(packsInfo[i]);
            }
          }
          this.loading = false;
          return assetPacks;
        },
        watch() {
          this.metamaskAddress;
        }
      },
      async assetsLength() {
        if (this.assetsPackType === 'created') {
          return this.createdPacksIDs.length;
        } else if (this.assetsPackType === 'bought') {
          return this.boughtPacksIDs.length;
        } else if (this.assetsPackType === 'all') {
          let numOfAssetsPacks = Number(await getNumberOfAssetPacks());
          return numOfAssetsPacks;
        }
      }
    },
    methods: {
      async changePage(currentPage) {
        let pageAssetPacksIds;
        let packsInfo;
        this.loading = true;
        if (this.assetsPackType === 'created') {
          pageAssetPacksIds = paginateArray(this.createdPacksIDs, currentPage, this.showPerPage);
          packsInfo = await getPackInformation(pageAssetPacksIds, this.metamaskAddress);
        } else if (this.assetsPackType === 'bought') {
          pageAssetPacksIds = paginateArray(this.boughtPacksIDs, currentPage, this.showPerPage);
          packsInfo = await getPackInformation(pageAssetPacksIds, this.metamaskAddress);
        } else if (this.assetsPackType === 'all') {
          pageAssetPacksIds = await getAllAssetsPacksInfo();
          packsInfo = paginateArray(pageAssetPacksIds, currentPage, this.showPerPage);
        }
        this.assetPacks = [];
        for (let i = 0; i < this.showPerPage; i++) {
          this.assetPacks.push(packsInfo[i]);
        }
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
                        display: flex;
                        flex-direction: column;
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