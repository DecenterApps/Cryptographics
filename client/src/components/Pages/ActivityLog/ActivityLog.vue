<template>
    <div class="activity-log-wrapper">
        <div class="container">
            <div class="activity-header">
                <div class="large-title">Activity log</div>
                <separator />
            </div>

            <div v-if="loading" class="loading-section">
                <loader />
            </div>

            <div v-else-if="!loading && gettingEventsError" class="error-wrapper">
                <h1>{{ gettingEventsError }}</h1>
            </div>

            <div v-else-if="!loading && !gettingEventsError" class="transactions-wrapper">
                <empty-state v-if="events.length === 0" :type="'activityLog'" />
                <div v-else class="transactions-content">
                    <div class="event" v-for="(event, index) in events" :key="index">
                        <div class="event-cover">
                            <img :src="event.graphicSrc || event.packCoverSrc">
                        </div>

                        <div class="event-content">
                            <div class="event-meta">
                                <user-link
                                        :to="'/user/' + event.ownerAddress"
                                        :name="event.ownerUsername"
                                        :avatar="event.ownerAvatar === 'default-avatar' ? defaultAvatar : event.ownerAvatar"
                                        color="gray"
                                />
                                <div class="event-title">
                                    <span v-if="event.type === 'ImageCreated'">Created cryptographic:</span>
                                    <span v-if="event.type === 'SellingImage'">Listing for sale:</span>
                                    <span v-if="event.type === 'ImageBought'">Bought cryptographic:</span>
                                    <span v-if="event.type === 'AssetPackCreated'">Created asset pack:</span>
                                    <span v-if="event.type === 'AssetPackBought'">Bought asset pack:</span>

                                    <router-link v-if="event.type === 'SellingImage' || event.type === 'ImageCreated' || event.type === 'ImageBought'" :to="`/cryptographic/${event.id}`">{{ event.title }}</router-link>
                                    <router-link v-if="event.type === 'AssetPackCreated' || event.type === 'AssetPackBought'" :to="`/asset-pack/${event.id}`">{{ event.title }}</router-link>
                                </div>

                                <div class="event-amount" v-if="event.type === 'SellingImage' || event.type === 'ImageBought'">
                                    <span>for</span>
                                    <price :value="event.amount.toString()" />
                                </div>

                                <div class="time-ago">
                                    <span
                                            v-if="event.timestamp"
                                            class="time-ago-label">
                                        {{ utils.getDateDiff(event.timestamp) }}
                                    </span>

                                    <a
                                            target="_blank" rel="noopener noreferrer" class="event-tx"
                                            :href="`https://${network === 42 ? 'kovan.' : ''}etherscan.io/tx/${event.txHash}`"
                                    >
                                        [VIEW TX]
                                    </a>
                                </div>
                            </div>

                            <div class="event-packs" v-if="event.type === 'ImageCreated'">
                                <div class="packs-header">Asset Pack used:</div>
                                <div class="packs-wrapper">
                                    <router-link
                                            :to="'/asset-pack/' + assetPack.id"
                                            v-for="(assetPack, index) in event.assetPacks"
                                            :key="index">
                                        <asset-box
                                                :key="index"
                                                :assetPack="assetPack"
                                                :small="true"
                                                :hover="true"
                                                action="zoom"
                                        ></asset-box>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { API_PATH, DEFAULT_AVATAR } from 'config/constants';
import { encodeQueryString, getDateDiff } from 'services/utils';
import EmptyState from 'shared/EmptyState/EmptyState.vue';
import config from 'config/clientConfig.json';
import utils from 'services/utils';

export default {
    name: 'ActivityLog',
    components: { EmptyState },
    data: () => ({
      loading: true,
      defaultAvatar: DEFAULT_AVATAR,
      gettingEventsError: false,
      events: [],
      network: config.network,
      lastCheckedBlock: 0,
      interval: null,
      utils,
    }),
    methods: {
        async getLastEvents(blockNumberFrom, blockNumberTo, onLoad = false) {
          this.lastCheckedBlock = blockNumberTo;

          try {
            let res = await fetch(`${API_PATH}/activity/events${encodeQueryString({ blockNumberFrom, blockNumberTo })}`);
            res = await res.json();

            this.events = [...res, ...this.events];
          } catch(err) {
            this.gettingEventsError = 'There was an error fetching past activity, please try again';
          }

          if (onLoad) this.loading = false;
        },
        subscribeToBlocks() {
          this.interval = setInterval(async () => {
            let res = await fetch(`${API_PATH}/block`);
            res = await res.json();

            if (res.blockNumber === this.lastCheckedBlock) return;

            this.getLastEvents(this.lastCheckedBlock + 1, res.blockNumber, false, true);
          }, 10000);
        }
    },
    async created() {
        let res = await fetch(`${API_PATH}/block`);
        res = await res.json();

        const blocksToSearch = 50000;

        this.getLastEvents(res.blockNumber - blocksToSearch, res.blockNumber, true);
        this.subscribeToBlocks();
    },
    beforeDestroy() {
        if (this.interval) clearInterval(this.interval);
    }
};
</script>

<style scoped lang="scss">
    .activity-log-wrapper {
        background-color: #EEEEEE;
        padding: 30px 0;

        .loading-section {
            width: 100%;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-color: #CECECE;
            margin-top: 30px;
        }

        .error-wrapper {
            margin: 20px 0;
            font-size: 20px;
            line-height: 52px;
            text-align: center;
            color: #BE0000;
        }

        .transactions-content {
            margin: 30px 0;

            .event {
                display: flex;
                padding-bottom: 34px;
                margin-bottom: 30px;
                width: max-content;

                &:not(:last-child) {
                    border-bottom: 1px solid black;
                }

                .event-cover {
                    margin-right: 16px;
                    flex-shrink: 0;

                    img {
                        width: 270px;
                    }
                }

                .event-title {
                    margin-top: 15px;
                    margin-bottom: 10px;

                    span {
                        font-size: 14px;
                        margin-right: 2px;
                    }

                    a {
                        color: #F55800;
                        text-decoration: underline;
                    }
                }

                .event-content {
                    display: inline-flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .time-ago {
                    display: flex;
                    align-items: center;

                    .time-ago-label {
                        color: #858585;
                        font-size: 12px;
                        margin-right: 5px;
                    }

                    .event-tx {
                        font-size: 10px;
                        color: #F55800;;
                    }
                }

                .event-amount {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 12px;

                    span { color: #858585; }
                    .price {
                        margin-left: 6px;
                        color: black;
                        font-size: 12px;
                        line-height: 10px;

                        &:before {
                            line-height: 9px;
                        }
                    }
                }

                .event-packs {

                    .packs-header {
                        font-size: 14px;
                        margin-bottom: 10px;
                    }

                    .packs-wrapper .asset-box {
                        border-color: white;
                        border-right: 4px solid white;
                        margin-right: 20px;
                    }
                }
            }
        }
    }
</style>