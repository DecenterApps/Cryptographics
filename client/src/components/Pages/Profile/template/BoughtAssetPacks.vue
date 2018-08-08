<template>
    <div>
        <div class="asset-packs-wrapper">
            <div
              class="asset-pack"
              v-for="(assetPack, index) in assetPacks"
              :key="index">
                <router-link to="ovde-bind-asset-page">
                  <img class="asset-pack-image" :src="assetPack.src" />
                  <div class="asset-meta">
                      <div class="asset-description">
                          <span class="asset-name">{{ assetPack.name }}</span>
                      </div>
                  </div>
                </router-link>
            </div>
        </div>
        <pagination
          :total="createdPacksIDs.length"
          :per-page="showPerPage"
          @updatePage="changePage"/>
    </div>
</template>

<script>
  import {
    getPaginatedAssetPacks,
    getPackInformation,
    getNumberOfAssetPacks,
    getCreatedAssetPacks
  } from 'services/ethereumService';
  import { mapGetters } from 'vuex';
  import { METAMASK_ADDRESS, CREATED_ASSETS_ID } from 'store/user-config/types';

  export default {
    name: 'BoughtAssetPacks',
    data: () => ({
      showPerPage: 2
    }),
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
        createdPacksIDs: CREATED_ASSETS_ID
      })
    },
    asyncComputed: {
      async assetPacks() {
        let pageAssetPacksIds = await getPaginatedAssetPacks(1, this.showPerPage, this.userAddress);
        let packsInfo = await getPackInformation(pageAssetPacksIds, this.userAddress);
        let assetPacks = [];
        for (let i = 0; i < this.showPerPage; i++) {
          assetPacks.push(packsInfo[i])
        }
        return assetPacks;
      }
    },
    methods: {
      async changePage(currentPage) {
        let pageAssetPacksIds = await getPaginatedAssetPacks(currentPage, this.showPerPage, this.userAddress);
        let packsInfo = await getPackInformation(pageAssetPacksIds, this.userAddress);
        this.assetPacks = [];
        for (let i = 0; i < this.showPerPage; i++) {
          await this.assetPacks.push(packsInfo[i])
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