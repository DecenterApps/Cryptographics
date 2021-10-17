<template>
  <layout layout-style="full-width" layout-content="no-container">
    <div class="container">
      <div class="header">
        <img v-if="avatar.length > 0" class="avatar" :src="avatar">
        <div class="left">
          <h1 class="large-title name">{{ username }}</h1>
          <cg-button
            button-style="secondary"
            v-if="userAddress && userProfile"
            @click="openModal('editProfile')"
          >Edit Profile</cg-button>
        </div>
        <div class="right button-group price-group">
          <price v-if="userProfile" :show-if-free="true" :value="totalBalance"/>
          <cg-button
            button-style="primary"
            v-if="userAddress && userProfile"
            @click="openModal('balances');"
          >Withdraw</cg-button>
        </div>
      </div>
      <div class="main">
        <template v-if="userAddress">
          <div class="tabs">
            <div class="current-tabs">
              <button
                @click="changeTab('gallery')"
                :class="['large-title', isActive('gallery')]"
              >{{ userProfile ? 'My cryptographics' : 'Cryptographics' }}</button>
              <button
                @click="changeTab('asset-packs')"
                :class="['large-title', isActive('asset-packs')]"
              >{{ userProfile ? 'My asset packs' : 'Asset packs' }}</button>
            </div>
          </div>
          <separator/>
          <div class="gallery" v-if="currentTab === 'gallery'">
            <div class="button-group">
              <cg-button
                :button-style="showGraphics === 'all' ? 'tab-active' : 'tab-inactive'"
                @click="showGraphics = 'all'"
              >All</cg-button>
              <cg-button
                :button-style="showGraphics === 'bought' ? 'tab-active' : 'tab-inactive'"
                @click="showGraphics = 'bought'"
              >Bought</cg-button>
              <cg-button
                :button-style="showGraphics === 'created' ? 'tab-active' : 'tab-inactive'"
                @click="showGraphics = 'created'"
              >Created {{userProfile ? 'by You' : ''}}</cg-button>
            </div>
            <paginated-gallery
              :emptyStateType="`profile-gallery-${showGraphics}${(userProfile ? '-own' : '')}`"
              :imageIds="shownImageIds"
              :display-overlay="true"
            />
          </div>
          <div class="assets" v-if="currentTab === 'asset-packs'">
            <div class="button-group">
              <cg-button
                :button-style="showPacks === 'all' ? 'tab-active' : 'tab-inactive'"
                @click="showPacks = 'all'"
              >All</cg-button>
              <cg-button
                :button-style="showPacks === 'bought' ? 'tab-active' : 'tab-inactive'"
                @click="showPacks = 'bought'"
              >Bought</cg-button>
              <cg-button
                :button-style="showPacks === 'created' ? 'tab-active' : 'tab-inactive'"
                @click="showPacks = 'created'"
              >Created {{userProfile ? 'by You' : ''}}</cg-button>
            </div>
            <asset-packs-pagination
              :asset-pack-ids="assetPackIds"
              :asset-packs-type="`profile-asset-packs-${showPacks}${(userProfile ? '-own' : '')}`"
              :show-per-page="16"
              :overlay="true"
              grid="row-4"
            />
          </div>
        </template>
        <template v-else>
          <p>
            In order to update your username and profile image you will need
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://metamask.io/"
            >MetaMask.</a>
          </p>
          <p>
            If you need help
            <a
              target="_blank"
              href="https://discordapp.com/invite/xnhfYRS"
            >get in touch</a>
            with us.
          </p>
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
  fromWei,
  getImageOwnerAndCreator,
  getCreatedGraphics
} from "services/ethereumService";
import { ipfsNodePath } from "config/constants";
import { mapActions, mapGetters } from "vuex";
import { TOGGLE_MODAL } from "store/modal/types";
import { DEFAULT_AVATAR } from "config/constants";
import {
  USERNAME,
  ADDRESS,
  AVATAR,
  SET_CREATED_ASSETS_PACKS_IDS,
  SET_BOUGHT_ASSETS_PACKS_IDS,
  CREATED_ASSETS_PACKS_IDS,
  BOUGHT_ASSETS_PACKS_IDS,
  BALANCES,
  FETCH_BALANCES
} from "store/user-config/types";
import utils from "services/utils";

import AssetPacksPagination from "./template/AssetPacksPagination.vue";
import PaginatedGallery from "shared/PaginatedGallery/PaginatedGallery.vue";

export default {
  name: "Profile",
  props: {
    userProfile: {
      type: Boolean
    }
  },
  data() {
    return {
      ipfsNodePath,
      showPacks: "all",
      showGraphics: "all",
      currentTab: "gallery",
      imageIds: [],
      boughtImageIds: [],
      createdImageIds: [],
      assetPackIds: [],
      userAddress: "0x0",
      username: "",
      avatar: ""
    };
  },
  components: {
    PaginatedGallery,
    AssetPacksPagination
  },
  beforeMount() {
    this[SET_CREATED_ASSETS_PACKS_IDS]();
    this[SET_BOUGHT_ASSETS_PACKS_IDS]();
  },
  async created() {
    await this.onCreated();
    if (this.userProfile && this.userAddress) this.fetchBalances();
    if (!this.userProfile)
      document.title = this.username + "'s profile | Cryptographics";
  },
  computed: {
    ...mapGetters({
      currentUserAddress: ADDRESS,
      currentUserUsername: USERNAME,
      currentUserAvatar: AVATAR,
      createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
      boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS,
      balances: BALANCES
    }),
    totalBalance() {
      const total =
        parseInt(this.balances.assetBalance) +
          parseInt(this.balances.marketplaceBalance) || 0;
      return fromWei(total, 3);
    },
    shownImageIds() {
      if (this.showGraphics === "all")
        return [...this.boughtImageIds, ...this.createdImageIds].sort(
          (a, b) => b - a
        );
      if (this.showGraphics === "bought")
        return this.boughtImageIds.slice().reverse();
      if (this.showGraphics === "created")
        return this.createdImageIds.slice().reverse();
    }
  },
  watch: {
    currentUserAddress: async function(val) {
      if (this.userProfile) {
        this.userAddress = val;
        this.imageIds = await getUserImages(val);
        this.fetchBalances();
        this.onCreated();
      }
    },
    currentUserUsername: function(val) {
      if (this.userProfile) {
        this.username = val;
      }
    },
    currentUserAvatar: function(val) {
      if (this.userProfile) {
        this.avatar = val;
      }
    },
    createdPacksIDs: async function(val) {
      if (this.showPacks === "created" || this.showPacks === "all")
        this.getAssetPacks();
    },
    boughtPacksIDs: async function(val) {
      if (this.showPacks === "bought" || this.showPacks === "all")
        this.getAssetPacks();
    },
    showPacks: async function(val) {
      this.getAssetPacks();
    },
    "$route.path": function(id) {
      this.onCreated();
    }
  },
  methods: {
    ...mapActions({
      openModal: TOGGLE_MODAL,
      fetchBalances: FETCH_BALANCES,
      SET_CREATED_ASSETS_PACKS_IDS,
      SET_BOUGHT_ASSETS_PACKS_IDS,
    }),
    async onCreated() {
      if (this.userProfile) {
        this.userAddress = this.currentUserAddress;
        this.username = this.currentUserUsername;
        this.avatar = this.currentUserAvatar;
      } else {
        this.userAddress = this.$route.params.userId;
        this.username = await getUsername(this.userAddress);
        const getAvatarBytes32 = await getAvatar(this.userAddress);
        const initialAvatar =
          "0x0000000000000000000000000000000000000000000000000000000000000000";
        if (getAvatarBytes32 === initialAvatar) {
          this.avatar = DEFAULT_AVATAR;
        } else {
          this.avatar =
            ipfsNodePath + utils.getIpfsHashFromBytes32(getAvatarBytes32);
        }
      }
      this.generateData();
    },
    async generateData() {
      await this.getImages();
      await this.getAssetPacks();
    },
    async getImages() {
      if (!this.userAddress) return;
      const imageIds = await getUserImages(this.userAddress);
      const imageInfo = await Promise.all(
        imageIds.map(getImageOwnerAndCreator)
      );
      this.imageIds = imageIds;
      this.createdImageIds = await getCreatedGraphics(this.userAddress);
      this.boughtImageIds = imageInfo
        .filter(image => image[0] !== image[1])
        .map(image => image.id);
    },
    async getAssetPacks() {
      if (this.userProfile) {
        if (this.showPacks === "all") {
          this.assetPackIds = [...this.createdPacksIDs, ...this.boughtPacksIDs];
        }
        if (this.showPacks === "created") {
          this.assetPackIds = this.createdPacksIDs;
        } else if (this.showPacks === "bought") {
          this.assetPackIds = this.boughtPacksIDs;
        }
      } else {
        if (this.showPacks === "all") {
          const promises = [
            await getCreatedAssetPacks(this.userAddress),
            await getBoughtAssetPacks(this.userAddress)
          ];
          Promise.all(promises).then(([created, bought]) => {
            this.assetPackIds = [...created, ...bought];
          });
        } else if (this.showPacks === "created") {
          this.assetPackIds = await getCreatedAssetPacks(this.userAddress);
        } else if (this.showPacks === "bought") {
          this.assetPackIds = await getBoughtAssetPacks(this.userAddress);
        }
      }
    },
    isActive(type) {
      return this.currentTab === type ? "active" : "";
    },
    changeTab(type) {
      this.currentTab = type;
    },
  }
};
</script>

<style scoped lang="scss">
.container {
  padding-top: 0 !important;
  flex-direction: column;
  position: relative;
  justify-content: flex-start !important;
  .line-separator {
    margin: 21px 0;
  }
  .tabs {
    .large-title {
      margin: 0 41px 0 0;
      @media screen and (max-width: 426px) {
        font-size: 25px;
        margin: 0;
        margin-bottom: 20px;
      }
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
      display: flex;
      .name {
        margin-bottom: 0;
        margin-right: 20px;
      }
    }
  }

  .price-group {
    display: flex;
    align-items: center;

    .price {
      max-width: 200px;
      margin-right: 10px;
      &:before {
        bottom: 2px;
      }
    }
  }

  .assets,
  .gallery {
    padding-bottom: 30px;
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
      width: 100%;
      .avatar {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  @media screen and (max-width: 426px) {
    .header {
      flex-direction: column;
      text-align: center;
      .left {
        margin-bottom: 40px;
        justify-content: center;
      }
      .right {
        justify-content: center;
      }
    }
  }
}
</style>
