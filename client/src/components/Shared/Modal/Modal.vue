<template>
  <div class="modal">
    <div class="overlay" @click="closeModal"></div>
    <div :class="['content', smallerPadding(content)]">
      <button-icon icon-type="close" @click="closeModal"/>
      <connection-modal v-if="content === 'connectionModal'"/>
      <edit-profile v-else-if="content === 'editProfile'"/>
      <edit-pack-price
        v-else-if="content && content.name === 'editPackPrice'"
        v-bind="content.data"
      />
      <set-username v-else-if="content === 'setUsername'"/>
      <meta-mask-info
        v-else-if="content === 'metaMaskInfo'"
        :hasMetaMask="hasMetaMask"
        :isMobile="isMobile"
        :isLocked="isLocked"
        :isApproved="isApproved"
      />
      <coinbase-info
        v-else-if="content && content.name === 'coinbaseInfo'"
        v-bind="content.data"
        :isApple="isApple"
        :isAndroid="isAndroid"
      />
      <transfer-history
        v-else-if="content && content.name === 'transferHistory'"
        v-bind="content.data"
      />
      <asset-pack-upload-error
        v-else-if="content && content.name === 'assetPackUploadError'"
        v-bind="content.data"
      />
      <balances-modal v-else-if="content === 'balances'"/>
      <success-message v-else :content="content"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TOGGLE_MODAL } from "store/modal/types";
import { ADDRESS, PROVIDER_CONNECTED } from "store/user-config/types";

import EditProfile from "shared/EditProfile/EditProfile.vue";
import ConnectionModal from "shared/ConnectionModal/ConnectionModal.vue";
import EditPackPrice from "shared/EditPackPrice/EditPackPrice.vue";
import SetUsername from "shared/SetUsername/SetUsername.vue";
import SuccessMessage from "shared/SuccessMessage/SuccessMessage.vue";
import TransferHistory from "shared/TransferHistory/TransferHistory.vue";
import MetaMaskInfo from "shared/MetaMaskInfo/MetaMaskInfo.vue";
import CoinbaseInfo from "shared/CoinbaseInfo/CoinbaseInfo.vue";
import AssetPackUploadError from "shared/AssetPackUploadError/AssetPackUploadError.vue";
import BalancesModal from "pages/Profile/BalancesModal.vue";

export default {
  name: "Modal",
  data: () => ({
    hasMetaMask: false,
    isMetaMaskLocked: false,
    isMobile: false
  }),
  props: {
    content: {
      default: ""
    }
  },
  components: {
    SuccessMessage,
    SetUsername,
    EditProfile,
    EditPackPrice,
    TransferHistory,
    BalancesModal,
    MetaMaskInfo,
    CoinbaseInfo,
    AssetPackUploadError,
    ConnectionModal,
  },
  watch: {
    userAddress: function(val) {
      this.isLocked = val;
    },
  },
  async beforeMount() {
    const { currentProvider: cp } = window._web3;
    const { userAgent: ua } = navigator;
    this.hasMetaMask = !!cp.isMetaMask;
    this.isAndroid = ua.includes("Android");
    this.isApple = ua.includes("iPhone") || ua.includes("iPad");
    this.isMobile = this.isAndroid || this.isApple;
    this.isLocked = this.userAddress;
  },
  computed: {
    ...mapGetters({
      userAddress: ADDRESS,
    })
  },
  methods: {
    ...mapActions({
      closeModal: TOGGLE_MODAL
    }),
    smallerPadding(content) {
      if (content === "metaMaskInfo") return "smaller-padding";

      return ["Cryptographic", "Asset pack"].indexOf(content) >= 0
        ? "small-padding"
        : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 100vh;
  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: fade-out(#000, 0.3);
  }
  .content {
    position: relative;
    max-width: 1120px;
    padding: 90px;
    background-color: #c4c4c4;
    margin: 30px;
    @media screen and (max-width: 768px) {
      max-width: 767px;
    }
    @media screen and (max-width: 425px) {
      max-width: 425px;
      width: 100%;
      padding: 45px 15px;
    }

    &.small-padding {
      padding: 45px;
    }

    &.smaller-padding {
      padding: 30px 60px 60px 60px;
    }

    .ico-button {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>
