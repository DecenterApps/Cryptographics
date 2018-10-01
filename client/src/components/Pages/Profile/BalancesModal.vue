<template>
    <div class="balances-modal-wrapper">
        <div>
            <h3 class="large-title">Account balances</h3>
        </div>
        <div>
            <h4>Asset Packs balance</h4>
            <p>These funds are collected from sales of your asset packs. </p>
            <div class="withdraw">
                <cg-button
                        button-style="secondary"
                        @click="withdraw('asset')"
                        :disabled="assetBalance === '0'"
                >Withdraw</cg-button>
                <span>ETH: {{assetBalance}}</span>
            </div>
        </div>
        <div>
            <h4>Cryptographics balance</h4>
            <p>These funds are earned by selling your Cryptographics. </p>
            <div class="withdraw">
                <cg-button
                        button-style="secondary"
                        @click="withdraw('marketplace')"
                        :disabled="marketplaceBalance === '0'"
                >Withdraw</cg-button>
                <span>ETH: {{marketplaceBalance}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { fromWei, withdraw } from 'services/ethereumService';
  import {
    METAMASK_ADDRESS,
    BOUGHT_ASSETS_PACKS_IDS,
    BALANCES,
    FETCH_BALANCES,
  } from 'store/user-config/types';

  export default {
    name: 'BalancesModal',
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        currentUserAddress: METAMASK_ADDRESS,
        boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS,
        balances: BALANCES,
      }),
      assetBalance() {
        return fromWei(this.balances.assetBalance, 3);
      },
      marketplaceBalance() {
        return fromWei(this.balances.marketplaceBalance, 3);
      },
    },
    methods: {
      ...mapActions({
        fetchBalances: FETCH_BALANCES,
      }),
      async withdraw(from) {
        await withdraw(from);
        setTimeout(() => this.fetchBalances(), 1000);
      }
    }
  };
</script>

<style scoped lang="scss">
    .balances-modal-wrapper {
        max-width: 300px;
        h4 {
            font-weight: normal;
            font-size: 16px;
            margin: 50px 0 5px;
        }
        p {
            font-size: 14px;
            color: #747474;
        }
        .withdraw {
            span {
                margin-left: 20px;
                vertical-align: top;
                line-height: 32px;
            }
        }
    }
</style>