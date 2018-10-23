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
                    EVENTS
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { METAMASK_ADDRESS } from 'store/user-config/types';
import EmptyState from 'shared/EmptyState/EmptyState.vue';
//
// const meta = [
//   { contract: assetManagerContract, event: 'AssetPackCreated' },
//   { contract: assetManagerContract, event: 'AssetPackBought' },
//   { contract: marketPlaceContract, event: 'ImageBought' },
//   { contract: marketPlaceContract, event: 'SellingImage' },
//   { contract: digitalPrintImageContract, event: 'ImageCreated' },
// ];

export default {
    name: 'ActivityLog',
    components: { EmptyState },
    data: () => ({
      loading: true,
      gettingEventsError: false,
      subscriptions: [],
      events: [],
    }),
    methods: {
    //     async getLastEvents() {
    //       const fromBlock = await web3.eth.getBlockNumber() - 50000;
    //
    //       const promises = meta.map(({ contract, event }) => getLatestEvents(contract, event, fromBlock));
    //
    //       try {
    //         this.events = await Promise.all(promises);
    //       } catch(err) {
    //         this.gettingEventsError = 'There was an error fetching past activity, please try again';
    //       }
    //
    //       this.loading = false;
    //     },
    //   async subscribeToNewEvents() {
    //
    //   }
    // },
    // created() {
    //     this.getLastEvents();
    //     this.subscribeToNewEvents();
    // },
    // beforeDestroy() {
    //   this.subscriptions.forEach(subscription => { subscription.unsubscribe(); });
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