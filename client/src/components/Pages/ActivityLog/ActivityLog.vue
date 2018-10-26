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
                        <div>{{ event.type }}</div>
                        <div>{{ event.txHash }}</div>
                        <div>{{ event.blockNumber }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { API_PATH } from 'config/constants';
import { encodeQueryString } from 'services/utils';
import EmptyState from 'shared/EmptyState/EmptyState.vue';

export default {
    name: 'ActivityLog',
    components: { EmptyState },
    data: () => ({
      loading: true,
      gettingEventsError: false,
      subscription: null,
      events: [],
    }),
    methods: {
        async getLastEvents(blockNumberFrom, onLoad = false, exactBlock = false) {
          try {
            let res = await fetch(`${API_PATH}/activity/events${encodeQueryString({ blockNumberFrom, exactBlock })}`);
            res = await res.json();

            this.events = [...res, ...this.events];
          } catch(err) {
            this.gettingEventsError = 'There was an error fetching past activity, please try again';
          }

          if (onLoad) this.loading = false;
        },
        subscribeToBlocks() {
          this.subscription = web3.eth.subscribe('newBlockHeaders', (error, result) => {
            if (error) {
              console.log('Getting block error', error);
              return;
            }

            setTimeout(() => {
              this.getLastEvents(result.number, false, true);
            }, 1000)
          })
        }
    },
    async created() {
        const blockNumber = await web3.eth.getBlockNumber();
        const blocksToSearch = 50000;

        this.getLastEvents(blockNumber - blocksToSearch, true);
        this.subscribeToBlocks();
    },
    beforeDestroy() {
      this.subscription.unsubscribe((error) => {
        if (error) console.log('Unsubscribe from block listener error', error);
        else console.log('Successfully unsubscribed from the block listener!');
      });
    }
};
</script>

<style scoped lang="scss">
    .activity-log-wrapper {
        margin: 30px 0;

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

        }
    }
</style>