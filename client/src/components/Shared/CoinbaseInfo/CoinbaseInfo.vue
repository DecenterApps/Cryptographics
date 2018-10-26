<template>
    <div class="coinbase-info">
        <ico-error />
        <div>
            <div class="text-wrapper">
                In order to interact with the blockchain and claim or trade your cryptographic you will need a DApp enabled browser or a mobile wallet. We recommend Status, Coinbase or Trust.
            </div>
            <div v-if="isApple" class="mobile-links-wrapper">
                <a href="https://itunes.apple.com/app/coinbase-wallet/id1278383455" target="_blank">
                    <img class="coinbase-logo" :src="CoinbaseLogo" alt="">
                </a>
                <hr>
                <a :href="`https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${deeplink}`" target="_blank">
                    <img class="trust-logo" :src="TrustLogo" alt="">
                </a>
            </div>
            <div v-if="isAndroid" class="mobile-links-wrapper">
                <a href="https://play.google.com/store/apps/details?id=org.toshi" target="_blank">
                    <img class="coinbase-logo" :src="CoinbaseLogo" alt="">
                </a>
                <hr>
                <a :href="`https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${deeplink}`" target="_blank">
                    <img class="trust-logo" :src="TrustLogo" alt="">
                </a>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import IcoError from '../../Shared/UI/Icons/IcoError';
  import CoinbaseLogo from './coinbase-wallet-logo.png';
  import TrustLogo from './trust-wallet-logo.png';

  export default {
    name: 'CoinbaseInfo',
    components: { IcoError },
    data: () => ({
      showMoreInfo: false,
      CoinbaseLogo,
      TrustLogo,
    }),
    props: {
      isApple: {
        type: Boolean
      },
      isAndroid: {
        type: Boolean
      },
      deeplink: {
        type: String,
        default: 'https://cryptographics.app/',
      },
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
        .mobile-links-wrapper {
            margin: 50px 0 0;
        }
        svg {
            display: block;
            margin: auto;
            margin-bottom: 27px;
        }
        .coinbase-logo {
            width: 240px;
            height: auto;
        }
        .trust-logo {
            width: 160px;
            height: auto;
        }
        hr {
            border: 0;
            border-top: 1px solid #717171;
            margin: 30px 0;
        }
    }
</style>