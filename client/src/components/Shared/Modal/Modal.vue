<template>
    <div class="modal">
        <div class="overlay" @click="closeModal"></div>
        <div :class="['content', smallerPadding(content)]">
            <button-icon
                icon-type="close"
                @click="closeModal" />
            <edit-profile v-if="content === 'editProfile'" />
            <set-username v-else-if="content === 'setUsername'" />
            <meta-mask-info v-else-if="content === 'metaMaskInfo'" :hasMetaMask="hasMetaMask" />
            <transfer-history v-else-if="content && content.name === 'transferHistory'" v-bind="content.data" />
            <asset-pack-upload-error v-else-if="content && content.name === 'assetPackUploadError'" v-bind="content.data" />
            <balances-modal v-else-if="content === 'balances'" />
            <success-message v-else :content="content" />
            <div v-else>
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';

  import EditProfile from 'shared/EditProfile/EditProfile.vue';
  import SetUsername from 'shared/SetUsername/SetUsername.vue';
  import SuccessMessage from 'shared/SuccessMessage/SuccessMessage.vue';
  import TransferHistory from 'shared/TransferHistory/TransferHistory.vue';
  import MetaMaskInfo from 'shared/MetaMaskInfo/MetaMaskInfo.vue';
  import AssetPackUploadError from 'shared/AssetPackUploadError/AssetPackUploadError.vue';
  import BalancesModal from 'pages/Profile/BalancesModal.vue';

  export default {
    name: 'Modal',
    data: () => ({
        hasMetaMask: false,
    }),
    props: {
      content: {
        default: ''
      }
    },
    components: {
      SuccessMessage,
      SetUsername,
      EditProfile,
      TransferHistory,
      BalancesModal,
      MetaMaskInfo,
      AssetPackUploadError,
    },
    created() {
        this.hasMetaMask = window.web3.eth.accounts.currentProvider.constructor.name === 'MetamaskInpageProvider';
    },
    methods: {
      ...mapActions({
        closeModal: TOGGLE_MODAL
      }),
      smallerPadding(content) {
        if (content === 'metaMaskInfo') return 'smaller-padding';

        return ['Cryptographic', 'Asset pack'].indexOf(content) >= 0 ? 'small-padding' : 0;
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
        z-index: 99;
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
            background-color: fade-out(#000, .3);
        }
        .content {
            position: relative;
            max-width: 1120px;
            padding: 90px;
            background-color: #C4C4C4;

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
