<template>
    <div class="coinbase-info">
        <ico-error />
        <div>
            <div class="text-wrapper">
                In order to interact with the blockchain and claim or trade your cryptographic you will need a DApp enabled browser or a mobile wallet. We recommend Status, Coinbase or Trust.
            </div>
            <div v-if="isApple">
                <a href="https://itunes.apple.com/app/coinbase-wallet/id1278383455" target="_blank">
                    <img class="coinbase-logo" :src="CoinbaseLogo" alt="">
                </a>
            </div>
            <div v-if="isAndroid">
                <a href="https://play.google.com/store/apps/details?id=org.toshi" target="_blank">
                    <img class="coinbase-logo" :src="CoinbaseLogo" alt=""> 
                </a>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import IcoError from '../../Shared/UI/Icons/IcoError';
  import CoinbaseLogo from './coinbase-wallet-logo.png'

  export default {
    name: 'CoinbaseInfo',
    components: { IcoError },
    data: () => ({
      showMoreInfo: false,
      CoinbaseLogo,
    }),
    props: {
        isApple: {
            type: Boolean
        },
        isAndroid: {
            type: Boolean
        }
    }
  };
</script>

<style scoped lang="scss">
    @import "../UI/button-styles";
    .coinbase-info {
        text-align: center;
        .text-wrapper {
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            max-width: 390px;
        }
        svg {
            display: block;
            margin: auto;
            margin-bottom: 27px;
        }
        .coinbase-logo {
            width: 280px;
            height: auto;
        }
    }
</style>