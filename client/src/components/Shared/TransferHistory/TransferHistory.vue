<template>
    <div>
        <div class="trade-history-header">
            <h3 class="large-title">Trade History</h3>
            <separator />
        </div>

        <div class="trade-history-content">
            <div class="loader-wrapper" v-if="fetchingTrades"><loader /></div>

            <div class="loaded-wrapper" v-if="!fetchingTrades">
                <div class="error-wrapper" v-if="fetchingTradesError">{{ fetchingTradesError }}</div>

                <div class="content-container" v-if="!fetchingTradesError">
                    <div class="empty-wrapper" v-if="trades.length === 0">
                        There are no previous trades for this graphic.
                    </div>

                    <div class="content-wrapper" v-if="trades.length > 0">
                        <div class="trades-list" v-for="(trade, index) in trades" :key="index">
                            <div class="trade">
                                <div class="index">{{ trades.length - index }}.</div>
                                <div class="buyer">
                                    <span @click="closeModal">
                                        <user-link
                                                :to="'/user/' + trade.buyerAddress"
                                                :name="trade.username"
                                                :avatar="trade.avatar"
                                                color="black"
                                                additionalClass="ellipsis"
                                        />
                                    </span>

                                    <span class="owner" v-if="index === 0">owner</span>
                                </div>
                                <div class="time">{{ trade.time }}</div>
                                <div class="price-wrapper">
                                    <price size="small" :value="trade.price" />
                                </div>
                            </div>
                        </div>

                        <div class="creator-wrapper">
                            <separator />
                            <span @click="closeModal">
                                <user-link
                                        :to="'/user/' + image.creator"
                                        :name="image.creatorMeta.username"
                                        :avatar="image.creatorMeta.avatar"
                                        color="black"
                                        @click="closeModal"
                                />
                            </span>
                            <span class="creator">creator</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import { getImageTransferHistory } from 'services/ethereumService';

  export default {
    name: 'TransferHistory',
    props: {
      image: {
        type: Object,
      }
    },
    data: () => ({
      fetchingTrades: false,
      fetchingTradesError: '',
      trades: [],
    }),
    methods: {
      ...mapActions({
        closeModal: TOGGLE_MODAL
      }),
    },
    async created() {
      this.fetchingTrades = true;

      try {
        const trades = await getImageTransferHistory(this.image.id);

        this.fetchingTrades = false;
        this.trades = trades;
      } catch (err) {
        this.fetchingTrades = false;
        this.fetchingTradesError = 'Can\'t get trade history at the moment, please try again later.';
      }
    }
  };
</script>

<style scoped lang="scss">
    .trade-history-header {
        text-align: left;
        margin: 0 0 20px 32px;

        .large-title {
            margin-bottom: 21px;
        }
    }

    .trade-history-content {
        width: 523px;
    }

    .loader-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        .loader-content {
            transform: scale(0.5);
        }
    }

    .error-wrapper {
        text-align: center;
        color: #BE0000;
        line-height: 25px;
    }

    .empty-wrapper {
        margin-top: 70px;
        text-align: center;
    }

    .creator, .owner {
        position: absolute;
        color: #9D9D9D;
        font-size: 12px;
        left: 43px;
        top: 41px;
    }

    .content-wrapper {

        .trades-list {

            .trade {
                display: flex;
                align-items: center;
                margin-bottom: 7px;

                .index {
                    font-size: 12px;
                    margin: 0 13px 0 9px;
                }

                .buyer {
                    position: relative;

                    .owner {
                        top: 26px;
                    }
                }

                .user {
                    width: 216px;
                }

                .price-wrapper {
                    width: 110px;
                    display: flex;
                    justify-content: flex-end;

                    .price {
                        max-width: 70px;
                    }
                }

                .time {
                    color: #9D9D9D;
                    font-size: 10px;
                    margin: 0 40px;
                }
            }
        }

        .creator-wrapper {
            margin-left: 30px;
            position: relative;

            .line-separator {
                background: rgba(0, 0, 0, 0.1);
                border-bottom: rgba(0, 0, 0, 0.1);
                margin: 11px 0;
                color: rgba(black, 0.9);
            }
        }
    }
</style>