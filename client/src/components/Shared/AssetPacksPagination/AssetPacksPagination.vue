<template>
    <div>
        <div class="asset-packs-wrapper">
            <div class="asset-pack" v-for="(assetPack, index) in assetPacks" :key="index">
                <img class="asset-pack-image" :src="assetPack.src" />
                <div class="asset-meta">
                    <div class="asset-description">
                        <span class="asset-thumbnail"></span>
                        <span class="asset-name">{{ assetPack.name }}</span>
                    </div>
                    <!--<span class="asset-owned"-->
                    <!--v-if="showAll">{{ stats_owned[key].owned }} / {{ stats_owned[key].total }} </span>-->
                </div>
            </div>
        </div>
        <div class="asset-controls">
            <cg-button
                    button-style="transparent"
                    v-if="pagination > 1"
                    @click="prevPage">Prev
            </cg-button>
            <cg-button
                    button-style="transparent"
                    v-if="assetPacks.length > 1"
                    @click="nextPage">Next
            </cg-button>
        </div>
    </div>
</template>

<script>
  import {
    getPaginatedAssetPacks,
    getPackInformation,
    getNumberOfAssetPacks
  } from 'services/ethereumService';
  import { mapGetters } from 'vuex';
  import { METAMASK_ADDRESS } from 'store/user-config/types';

  const NUM_PER_PAGE = 2;

  export default {
    name: 'AssetPacksPagination',
    data: () => ({
      assetPacks: [],
      pagination: 1,
    }),
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
      })
    },
    props: ['showAll'],
    async created() {
      if (this.showAll) {
        this.getPacks(this.pagination, NUM_PER_PAGE);
      } else {
        this.getMyAssetPacks(this.pagination, NUM_PER_PAGE);
      }
    },

    methods: {
      async getMyAssetPacks(page, count) {
        const assetPacksIds = await getPaginatedAssetPacks(page, count, this.userAddress);
        this.assetPacks = await getPackInformation(assetPacksIds, this.userAddress);
      },

      async getPacks(page, count) {
        let ids = [];
        let numberOfPacks = await getNumberOfAssetPacks();
        for (let i = (page - 1) * count; i < page * count; i++) {
          if (i < numberOfPacks) {
            ids.push(i);
          }
        }
        this.assetPacks = await getPackInformation(ids, this.userAddress);
      },

      nextPage() {
        this.assetPacks = [];
        this.pagination++;
        if (this.showAll) {
          this.getPacks(this.pagination, NUM_PER_PAGE);
        } else {
          this.getMyAssetPacks(this.pagination, NUM_PER_PAGE);
        }
      },

      prevPage() {
        if (this.pagination === 1) return;
        this.assetPacks = [];
        this.pagination--;
        if (this.showAll) {
          this.getPacks(this.pagination, NUM_PER_PAGE);
        } else {
          this.getMyAssetPacks(this.pagination, NUM_PER_PAGE);
        }
      }
    }

  };
</script>

<style scoped lang="scss">
    .asset-packs-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 40px 0;
        .asset-pack {
            font-family: 'YoungSerif-Regular', sans-serif;
            font-size: 22px;
            margin-bottom: 40px;
            .asset-pack-image {
                height: 365px;
                width: 500px;
            }
            .asset-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                .asset-thumbnail {
                    display: inline-block;
                    height: 33px;
                    width: 33px;
                    border-radius: 100%;
                    background-color: #909090;
                    margin-right: 15px;
                }
            }
        }
    }

    .asset-controls {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        button:first-child {
            margin-right: 10px;
        }
        margin: 30px 0;
    }
</style>