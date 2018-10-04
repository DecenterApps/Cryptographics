<template>
    <div>
        <div v-if="loading" class="loading-section">
            <loader />
            <h3>Please wait, we are loading asset packs from the blockchain and IPFS.</h3>
        </div>
        <div v-if="assetPacks !== false && this.loading === false" class="asset-packs" :class="grid">
            <div
                    class="asset-pack"
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
                                </div>
                                <div class="bottom">
                                    <user-link
                                            :to="'/user/' + assetPack.creator"
                                            :name="assetPack.username"
                                            :avatar="ipfsNodePath + assetPack.userAvatar"
                                            color="white" />
                                    <price
                                            :value="assetPack.price"
                                            :showIfFree="true"
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
                :total="filteredIds === null ? 0 : filteredIds.length"
                :per-page="showPerPage"
                @updatePage="changePage" />

        <empty-state v-if="filteredIds.length === 0" :type="assetPacksType" />
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
    BOUGHT_ASSETS_PACKS_IDS,
    BANNED_ASSET_PACK_IDS,
  } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import { ipfsNodePath } from 'config/constants';
  import EmptyState from '../../../Shared/EmptyState/EmptyState';

  export default {
    name: 'AssetPacksPagination',
    components: { EmptyState },
    props: {
      assetPacksType: {
        type: String,
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
        filteredIds: [],
      };
    },
    computed: {
      ...mapGetters({
        metamaskAddress: METAMASK_ADDRESS,
        bannedIDs: BANNED_ASSET_PACK_IDS,
      })
    },
    created() {
      this.filteredIds = this.assetPackIds.filter(id => this.bannedIDs.indexOf(parseInt(id, 10)) === -1);
    },
    watch: {
      assetPackIds: function (assetPackIds) {
        this.filteredIds = assetPackIds.filter(id => this.bannedIDs.indexOf(parseInt(id, 10)) === -1);
        console.log(this.filteredIds, assetPackIds);
      }
    },
    asyncComputed: {
      assetPacks: {
        async get() {
          this.loading = true;
          const selectedPacks = paginateArray(this.filteredIds, 1, this.showPerPage);
          const assetPacks = await getPackInformation(selectedPacks);
          this.loading = false;
          console.log(assetPacks);
          return assetPacks;
        }
      },
    },
    methods: {
      async changePage(currentPage) {
        this.loading = true;
        const selectedPacks = paginateArray(this.filteredIds, currentPage, this.showPerPage);
        this.assetPacks = await getPackInformation(selectedPacks);
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
    .asset-packs {
        margin-top: 30px;
        &.row-2 {
            .asset-pack {
                width: 45%;
                margin-right: 5%;
                margin-bottom: 5%;
                &:nth-child(2n) {
                    margin-right: 0;
                }
            }
        }
        &.row-4 {
            .asset-pack {
                width: 23%;
                margin-right: 2.6%;
                margin-bottom: 2.6%;
                &:nth-child(4n) {
                    margin-right: 0;
                }
            }
        }
        .asset-pack {
            position: relative;
            font-family: 'YoungSerif-Regular', sans-serif;
            font-size: 22px;
            margin-bottom: 20px;
            display: inline-block;
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
                            position: absolute;
                        }
                    }
                    .bottom {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .user { max-width: 150px }
                        .price { max-width: 75px; }
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
        flex-direction: column;
        background-color: #CECECE;
        margin-top: 30px;

        .loader-content {
            margin-bottom: 20px;
        }
    }
</style>