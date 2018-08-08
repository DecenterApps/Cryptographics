<template>
    <div>
        <div class="asset-packs">
            <div
              class="asset-pack"
              v-if="assetPacks !== false"
              v-for="(assetPack, index) in assetPacks"
              :key="index">
                <router-link v-if="assetPack" :to="'/asset-pack/' + assetPack.id">
                  <img class="image" :src="'https://ipfs.decenter.com/ipfs/' + assetPack.src"/>
                  <div class="meta">
                    <div class="description">
                        <span class="name">{{ assetPack.name }}</span>
                    </div>
                  </div>
                </router-link>
            </div>
            <div v-if="assetPacks === false">
              <p>You haven't created any asset packs yet.</p>
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
  getNumberOfAssetPacks
} from 'services/ethereumService';
import { mapGetters } from 'vuex';
import { METAMASK_ADDRESS, CREATED_ASSETS_ID } from 'store/user-config/types';

export default {
  name: 'CreatedAssetPacks',
  data() {
    return {
      showPerPage: 2
    }
  },
  computed: {
    ...mapGetters({
      userAddress: METAMASK_ADDRESS,
      createdPacksIDs: CREATED_ASSETS_ID
    })
  },
  asyncComputed: {
    assetPacks: {
      async get () {
        let pageAssetPacksIds = await getPaginatedAssetPacks(1, this.showPerPage, this.userAddress);
        let packsInfo = await getPackInformation(pageAssetPacksIds, this.userAddress);
        let assetPacks = [];
        if (pageAssetPacksIds.length === 0) {
          assetPacks = false;
        } else {
          for (let i = 0; i < this.showPerPage; i++) {
            assetPacks.push(packsInfo[i])
          }
        }
        return assetPacks;
      },
      watch () {
        this.userAddress
      }
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
.asset-packs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 30px;
    .asset-pack {
        flex: 0 0 45%;
        min-height: 411px;
        font-family: 'YoungSerif-Regular', sans-serif;
        font-size: 22px;
        margin-bottom: 20px;
        a {
          text-decoration: none;
          color: #000;
        }
        .image {
          width: 100%;
          height: auto;
        }
        .meta {
            padding: 10px 0;
        }
    }
  @media screen and (max-width: 767px) {
    flex-direction: column;    
  }
}
</style>