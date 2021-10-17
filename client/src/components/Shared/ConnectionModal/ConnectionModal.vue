<template>
    <div>
        <h3 class="large-title">Connect wallet</h3>
        <p class="description">Please select a wallet to connect to Cryptographics</p>
        <ul class="wallet-list">
          <li @click="login('metamask');">
            <ico-meta-mask />
            <span>MetaMask</span>
          </li>
          <li  @click="login('walletconnect');">
            <ico-wallet-connect />
            <span>WalletConnect</span>
          </li>
        </ul>
    </div>
</template>

<script>
  import IcoMetaMask from '../UI/Icons/IcoMetaMask';
  import IcoWalletConnect from '../UI/Icons/IcoWalletConnect';
  import { mapActions } from 'vuex';
  import { CONNECT_TO_SELECTED_WALLET } from '../../../store/modules/user-config/types';

  export default {
    name: 'ConnectionModal',
    components: {
      IcoMetaMask,
      IcoWalletConnect,
    },
    methods: {
      ...mapActions({
        login: CONNECT_TO_SELECTED_WALLET,
      }),
    },
  };
</script>

<style lang="scss" scoped>
    .wallet-list {
      width: 450px;
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(2, 1fr);
      @media screen and (max-width: 630px) {
        width: 100%;
      }
      @media screen and (max-width: 420px) {
        gap: 7px;
      }
      li {
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #B0B0B0;
        cursor: pointer;
        min-height: 50px;
        &:hover {
          background-color: #bbbbbb;
        }
        svg {
          margin-bottom: 10px;
        }
        @media screen and (max-width: 420px) {
          padding: 7px;
        }
      }
    }
    .large-title {
        margin-bottom: 15px;
        @media screen and (max-width: 525px) {
            text-align: center;
        }
    }
    .description {
      margin-bottom: 30px;
      @media screen and (max-width: 525px) {
        text-align: center;
      }
    }
</style>
