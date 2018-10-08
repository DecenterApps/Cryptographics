<template>
    <div class="balances-modal-wrapper">
        <div>
            <h3 class="large-title">Account balances</h3>
        </div>
        <div class="acc-wrapper">
            <div class="label">Withdraw address:</div>
            <div class="val">{{ currentUserAddress.toLowerCase() }}</div>
        </div>
        <div>
            <h4>Asset Packs balance</h4>
            <p>These funds are collected from sales of your asset packs. </p>
            <div class="withdraw">
                <cg-button
                        button-style="secondary"
                        @click="withdraw('asset')"
                        :disabled="assetBalance === '0'"
                >Withdraw
                </cg-button>
                <span class="eth-wrapper">
                    <span>ETH:</span>
                    <span class="eth">{{assetBalance}}</span>
                </span>
            </div>
        </div>
        <div>
            <h4>Cryptographics balance</h4>
            <p>These funds are earned by selling your cryptographics. </p>
            <div class="withdraw">
                <cg-button
                        button-style="secondary"
                        @click="withdraw('marketplace')"
                        :disabled="marketplaceBalance === '0'"
                >Withdraw
                </cg-button>
                <span class="eth-wrapper">
                    <span>ETH:</span>
                    <span class="eth">{{marketplaceBalance}}</span>
                </span>
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
  import {
    SHOW_LOADING_MODAL,
    HIDE_LOADING_MODAL,
    CHANGE_LOADING_CONTENT,
    TOGGLE_MODAL,
  } from 'store/modal/types';

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
        openModal: TOGGLE_MODAL,
        fetchBalances: FETCH_BALANCES,
        openLoadingModal: SHOW_LOADING_MODAL,
        closeLoadingModal: HIDE_LOADING_MODAL,
        changeLoadingContent: CHANGE_LOADING_CONTENT,
      }),
      async withdraw(from) {
        this.openLoadingModal('Please confirm the transaction in MetaMask.');
        const transactionPromise = await withdraw(from);
        this.changeLoadingContent('Please wait while the transaction is written to the blockchain. You will receive your funds shortly.');
        const result = await transactionPromise();
        this.closeLoadingModal();
        this.openModal('Transaction successful! Please check your wallet balance.');
        this.fetchBalances();
      }
    }
  };
</script>

<style scoped lang="scss">
    .balances-modal-wrapper {
        max-width: 480px;

        .large-title {
            margin-bottom: 20px;
        }

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

        .eth-wrapper {
            display: inline-flex;

            span {
                margin-left: 0;
            }

            .eth {
                margin-left: 5px;
                max-width: 50px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .acc-wrapper {

            .label {
                font-size: 16px;
                margin-bottom: 5px;
            }

            .val {
                font-size: 14px;
                color: #747474;
            }
        }
    }
</style>