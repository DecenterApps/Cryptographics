<template>
    <layout layout-style="full-width" layout-content="no-container">
        <div class="container">
            <div class="header">
                <img v-if="avatar.length > 0" class="avatar" :src="ipfsNodePath + avatar">
                <div class="left">
                    <h1 class="large-title name">{{ username }}</h1>
                </div>
                <div class="right button-group">
                    <cg-button
                            button-style="secondary"
                            v-if="userAddress"
                            @click="openModal('editProfile')">
                        Edit Profile
                    </cg-button>
                    <!--<button-link-->
                    <!--to="/upload-asset-pack">-->
                    <!--Create Asset Pack-->
                    <!--</button-link>-->
                </div>
            </div>
            <div class="main">
                <template v-if="userAddress">
                    <div class="tabs">
                        <div class="current-tabs">
                            <button @click="changeTab('gallery')" :class="['large-title', isActive('gallery')]">
                                Gallery
                            </button>
                            <button @click="changeTab('asset-packs')" :class="['large-title', isActive('asset-packs')]">
                                Asset Packs
                            </button>
                        </div>
                    </div>

                    <separator />

                    <div class="gallery" v-if="currentTab === 'gallery'">
                        <paginated-gallery :imageIds="imageIds" :display-overlay="true" />
                    </div>

                    <div class="assets" v-if="currentTab === 'asset-packs'">
                        <div class="button-group">
                            <cg-button
                                    :button-style="showPacks === 'all' ? 'tab-active' : 'tab-inactive'"
                                    @click="showPacks = 'all'">
                                All
                            </cg-button>
                            <cg-button
                                    :button-style="showPacks === 'bought' ? 'tab-active' : 'tab-inactive'"
                                    @click="showPacks = 'bought'">
                                Bought
                            </cg-button>
                            <cg-button
                                    :button-style="showPacks === 'created' ? 'tab-active' : 'tab-inactive'"
                                    @click="showPacks = 'created'">
                                Created by You
                            </cg-button>
                        </div>
                        <asset-packs-pagination
                                :asset-pack-ids="assetPackIds"
                                :asset-packs-type="showPacks"
                                :show-per-page="16"
                                :overlay="true"
                                grid="row-4"
                        />
                    </div>
                </template>
                <template v-else>
                    <p>Connect to MetaMask.</p>
                </template>
            </div>
        </div>
    </layout>
</template>

<script>
  import {
    getUserImages,
    getAvatar,
    getUsername,
    getCreatedAssetPacks,
    getBoughtAssetPacks,
  } from 'services/ethereumService';
  import { ipfsNodePath } from 'config/constants';
  import { mapActions, mapGetters } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import {
    USERNAME,
    METAMASK_ADDRESS,
    AVATAR,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS,
  } from 'store/user-config/types';
  import utils from 'services/utils';

  import AssetPacksPagination from './template/AssetPacksPagination.vue';
  import PaginatedGallery from 'shared/PaginatedGallery/PaginatedGallery.vue';

  export default {
    name: 'Profile',
    props: {
      userProfile: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        ipfsNodePath,
        showPacks: 'all',
        currentTab: 'gallery',
        imageIds: [],
        assetPackIds: [],
        userAddress: '0x0',
        username: '',
        avatar: '',
      };
    },
    components: {
      PaginatedGallery,
      AssetPacksPagination
    },
    computed: {
      ...mapGetters({
        currentUserAddress: METAMASK_ADDRESS,
        currentUserUsername: USERNAME,
        currentUserAvatar: AVATAR,
        createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS
      })
    },
    watch: {
      currentUserAddress: async function (val) {
        console.log(val);
        if (this.userProfile) {
          this.userAddress = val;
          this.imageIds = await getUserImages(val);
        }
      },
      createdPacksIDs: async function (val) {
        if (this.showPacks === 'created' || this.showPacks === 'all') this.getAssetPacks();
      },
      boughtPacksIDs: async function (val) {
        if (this.showPacks === 'bought' || this.showPacks === 'all') this.getAssetPacks();
      },
      showPacks: async function (val) {
        this.getAssetPacks();
      },
      '$route.path': function (id) {
        this.onCreated()
      }
    },
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL
      }),
      async onCreated() {
        if (this.userProfile) {
          this.userAddress = this.currentUserAddress;
          this.username = this.currentUserUsername;
          this.avatar = this.currentUserAvatar;
        } else {
          this.userAddress = this.$route.params.userId;
          this.username = await getUsername(this.userAddress);
          this.avatar = utils.getIpfsHashFromBytes32(await getAvatar(this.userAddress));
        }
        this.generateData();
      },
      async generateData() {
        await this.getImages();
        await this.getAssetPacks();
      },
      async getImages() {
        if (!this.userAddress) return;
        this.imageIds = await getUserImages(this.userAddress);
      },
      async getAssetPacks() {
        if (this.userProfile) {
          if (this.showPacks === 'all') {
            this.assetPackIds = [...this.createdPacksIDs, ...this.boughtPacksIDs];
          }
          if (this.showPacks === 'created') {
            this.assetPackIds = this.createdPacksIDs;
          } else if (this.showPacks === 'bought') {
            this.assetPackIds = this.boughtPacksIDs;
          }
        } else {
          if (this.showPacks === 'all') {
            const promises = [await getCreatedAssetPacks(this.userAddress), await getBoughtAssetPacks(this.userAddress)];
            Promise.all(promises)
              .then(([created, bought]) => {
                this.assetPackIds = [...created, ...bought];
              });
          }
          else if (this.showPacks === 'created') {
            this.assetPackIds = await getCreatedAssetPacks(this.userAddress);
          } else if (this.showPacks === 'bought') {
            this.assetPackIds = await getBoughtAssetPacks(this.userAddress);
          }
        }
      },
      isActive(type) {
        return this.currentTab === type ? 'active' : '';
      },
      changeTab(type) {
        this.currentTab = type;
      }
    },
    created() {
      this.onCreated()
    },
  };

</script>

<style scoped lang="scss">
    .container {
        padding-top: 0 !important;
        flex-direction: column;
        position: relative;
        /*min-height: calc(100vh - 419px);*/
        justify-content: flex-start !important;

        .line-separator {
            margin: 21px 0;
        }

        .tabs {

            .large-title {
                margin: 0 41px 0 0;
            }

            .current-tabs {
                button {
                    border: 0;
                    outline: 0;
                    background: none;
                    color: #858585;
                    cursor: pointer;

                    &.active {
                        color: #000;
                    }
                }
            }
        }

        .header {
            padding-left: 190px;
            padding-top: 47px;
            margin-bottom: 60px;
            display: flex;
            justify-content: space-between;
            .avatar {
                width: 160px;
                height: 160px;
                position: absolute;
                top: -80px;
                left: 0;
                background: white;
                border-radius: 4px;
            }
            .left {
                .name {
                    margin-bottom: 0;
                }
            }
        }
        .assets, .gallery {
            padding-bottom: 30px;
            /*min-height: 650px;*/
            .button-group {
                .button {
                    min-width: auto;
                }
            }
        }
        @media screen and (max-width: 1120px) {
            .header {
                padding-left: 0;
                padding-top: 127px;
                .avatar {
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
        @media screen and (max-width: 767px) {
            .header {
                flex-direction: column;
                text-align: center;
                .left {
                    margin-bottom: 20px;
                }
            }
        }
    }
</style>