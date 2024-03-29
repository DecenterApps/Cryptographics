<template>
  <div class="all-assets-page">
    <div class="container">
      <div class="asset-pack-header">
        <div class="left-section">
          <div class="meta-info">
            <h1 class="large-title">{{ assetPack.packName }}</h1>
            <p class="small-title" v-if="assetPack.assets.length !== 1 && backgroundAssets === 1">
              This asset pack contains {{ assetPack.assets.length }} assets, {{ backgroundAssets }} of which
              is a background
            </p>
            <p
              class="small-title"
              v-if="assetPack.assets.length === 1 && backgroundAssets === 1"
            >This asset pack contains {{ assetPack.assets.length }} asset and it is a background</p>
            <p class="small-title" v-if="backgroundAssets > 1">
              This asset pack contains {{ assetPack.assets.length }} assets, {{ backgroundAssets }} of which
              are backgrounds
            </p>
            <p
              class="small-title"
              v-if="assetPack.assets.length !== 1 && backgroundAssets === 0"
            >This asset pack contains {{ assetPack.assets.length }} assets, none of which are backgrounds</p>
            <p
              class="small-title"
              v-if="assetPack.assets.length === 1 && backgroundAssets === 0"
            >This asset pack contains {{ assetPack.assets.length }} asset, none of which are backgrounds</p>
          </div>
          <div class="meta-info">
            <p class="small-title">Created by:</p>
            <user-link
              :to="'/user/' + assetPack.creator"
              :name="creator.username"
              :avatar="creator.avatar"
            />
          </div>
          <div class="meta-info" v-if="assetPack.packDescription">
            <p class="small-title">Description:</p>
            <p class="asset-pack-description">{{ assetPack.packDescription }}</p>
          </div>
        </div>
        <div class="right-section">
          <price size="medium" :value="this.assetPack.price" :showIfFree="true"/>
          <cg-button @click="composeWithAP" buttonStyle="secondary">Compose with this Asset Pack</cg-button>
          <cg-button
            v-if="!alreadyBought && !isPackUsers && providerConnected"
            @click="purchaseAssetPack"
          >Buy</cg-button>
          <cg-button
            v-if="isPackUsers"
            buttonStyle="secondary"
            @click="openChangePriceModal"
          >Change Price</cg-button>
        </div>
      </div>
      <div class="asset-list">
        <div class="asset" v-for="(asset, index) in assetPack.assets" :key="index">
          <span v-if="Math.floor((asset.attribute / 100) % 10) === 1" class="asset-type">Background</span>
          <span v-else class="asset-type">Asset</span>
          <img :src="asset.src" alt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  buyAssetPack,
  getAssetPackData,
  checkAssetPermission,
  getUserInfo
} from "services/ethereumService";
import {
  USERNAME,
  ADDRESS,
  AVATAR,
  NOTIFICATIONS,
  PUSH_NOTIFICATION,
  REMOVE_NOTIFICATION,
  PROVIDER_CONNECTED
} from "store/user-config/types";
import { SELECT_SINGLE_ASSET_PACK } from "store/canvas/types";
import {
  TOGGLE_MODAL,
  TOGGLE_LOADING_MODAL,
  CHANGE_LOADING_CONTENT,
  HIDE_LOADING_MODAL
} from "store/modal/types";
import AssetsPackPagination from "../Profile/template/AssetPacksPagination.vue";
import { parseError } from "../../../services/helpers";

export default {
  name: "AssetPackPreview",
  components: {
    AssetsPackPagination
  },
  data() {
    return {
      assetPack: {
        packName: "",
        assets: []
      },
      creator: "",
      alreadyBought: false,
      backgroundAssets: 0,
      isPackUsers: false
    };
  },
  computed: {
    ...mapGetters({
      userAddress: ADDRESS,
      notifications: NOTIFICATIONS,
      providerConnected: PROVIDER_CONNECTED
    })
  },
  methods: {
    ...mapActions({
      toggleLoadingModal: TOGGLE_LOADING_MODAL,
      closeLoadingModal: HIDE_LOADING_MODAL,
      selectSingleAssetPack: SELECT_SINGLE_ASSET_PACK,
      openModal: TOGGLE_MODAL,
      pushNotification: PUSH_NOTIFICATION,
      removeNotification: REMOVE_NOTIFICATION
    }),
    openChangePriceModal() {
      this.openModal({
        name: "editPackPrice",
        data: {
          assetPackId: parseInt(this.assetPack.id),
          price: this.assetPack.price,
          thumbnail: this.assetPack.packCoverSrc
        }
      });
    },
    composeWithAP() {
      this.selectSingleAssetPack(this.assetPack);
      this.$router.push("/create-cryptographic?selected=true");
    },
    async purchaseAssetPack() {
      try {
        this.toggleLoadingModal("Please confirm the transaction in MetaMask.");
        const transactionPromise = await buyAssetPack(
          this.userAddress,
          this.$route.params.id
        );
        this.closeLoadingModal();
        this.$router.push("/");
        this.pushNotification({
          status: "loading",
          message:
            "Please wait while the transaction is written to the blockchain. Asset pack will be bought shortly."
        });
        const result = await transactionPromise();
        this.removeNotification(this.notifications.length - 1);
        this.pushNotification({
          status: "success",
          message: `Cryptographic successfully submitted for sale.`
        });
      } catch (e) {
        console.error(e);
        this.removeNotification(this.notifications.length - 1);
        this.pushNotification({
          status: "error",
          message: parseError(e)
        });
      }
    }
  },
  async created() {
    this.assetPack = await getAssetPackData(this.$route.params.id);
    this.creator = await getUserInfo(this.assetPack.creator);
    this.isPackUsers = this.assetPack.creator === this.userAddress;
    this.alreadyBought = await checkAssetPermission(
      this.userAddress,
      this.$route.params.id
    );
    this.assetPack.assets.forEach(asset => {
      Math.floor((asset.attribute / 100) % 10) === 1
        ? (this.backgroundAssets += 1)
        : null;
    });
    document.title = this.assetPack.packName + " - Asset pack | Cryptographics";
  }
};
</script>

<style scoped lang="scss">
.large-title {
  margin-bottom: 15px;
}

.right-section {
  display: flex;
  justify-content: center;
}
.meta-info {
  margin-bottom: 25px;
  &:last-of-type {
    margin-bottom: 35px;
  }
}
.small-title {
  margin-bottom: 8px;
  font-size: 12px;
  font-family: Roboto, sans-serif;
}

.asset-pack-description {
  font-weight: 300;
  line-height: 19px;
  font-size: 12px;
  color: #717171;
  max-width: 432px;
}

.asset-pack-header {
  padding-top: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    .left-section {
      width: 100%;
      .asset-pack-description {
        max-width: none;
      }
    }
    .right-section {
      margin-bottom: 60px;
      @media screen and (max-width: 430px) {
        flex-direction: column;
        align-items: center;
        width: 100%;
        .price {
          margin-bottom: 20px;
        }
        .button {
          margin: 0;
          margin-bottom: 20px;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .price {
    display: flex;
    align-items: center;
  }
  a {
    text-decoration: none;
  }

  button {
    margin-left: 20px;
  }
}

.asset-list {
  margin-bottom: 120px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(208px, 1fr));
  grid-auto-rows: minmax(208px, 1fr);
  grid-auto-flow: row;
  grid-gap: 20px;
  .asset {
    position: relative;
    text-align: center;
    background-color: #ececec;
    padding: 30px 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    justify-items: center;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      .asset-type {
        opacity: 1;
        background-color: #000;
      }
    }
    .asset-type {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #c7c7c7;
      color: #fff;
      padding: 5px 10px;
      font-size: 12px;
      min-height: 22px;
      min-width: 22px;
      pointer-events: none;
      transition: all 0.2s ease-in-out;
      opacity: 0.6;
    }
    img {
      position: relative;
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
