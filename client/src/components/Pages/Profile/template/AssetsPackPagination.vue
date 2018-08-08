<template>
    <div>
        <div v-if="assetPacks !== false" class="asset-packs">
            <div
              class="asset-pack"
              v-if="assetPack"
              v-for="(assetPack, index) in assetPacks"
              :key="index">
                <router-link :to="'/asset-pack/' + assetPack.id">
                  <img class="image" :src="'https://ipfs.decenter.com/ipfs/' + assetPack.src"/>
                  <div class="meta">
                    <div class="description">
                        <span class="name">{{ assetPack.name }}</span>
                    </div>
                  </div>
                </router-link>
            </div>
            <pagination
              :total="assetsPackType === 'created' ? createdPacksIDs.length : boughtPacksIDs.length"
              :per-page="showPerPage"
              @updatePage="changePage"/>
        </div>
        <div v-if="assetPacks === false" class="asset-packs">
              <p v-if="assetsPackType === 'created'">You haven't created any assets pack yet.</p>
              <p v-if="assetsPackType === 'bought'">You haven't bought any assets pack yet. Go to <router-link to="/assets-pack-market">market</router-link>.</p>
        </div>
    </div>
</template>

<script>
import {
  paginateCreatedAssetPacks,
  paginateBoughtAssetPacks,
  getPackInformation,
  getNumberOfAssetPacks
} from 'services/ethereumService';
import { mapGetters } from 'vuex';
import { METAMASK_ADDRESS, CREATED_ASSETS_PACKS_IDS, BOUGHT_ASSETS_PACKS_IDS } from 'store/user-config/types';

export default {
  name: 'AssetsPackPagination',
  props: {
    assetsPackType: {
      type: String,
      default: 'created'
    },
    showPerPage: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapGetters({
      userAddress: METAMASK_ADDRESS,
      createdPacksIDs: CREATED_ASSETS_PACKS_IDS,
      boughtPacksIDs: BOUGHT_ASSETS_PACKS_IDS
    })
  },
  asyncComputed: {
    assetPacks: {
      async get () {
        let pageAssetPacksIds;
        if (this.assetsPackType === 'created') {
          pageAssetPacksIds = await paginateCreatedAssetPacks(1, this.showPerPage, this.userAddress);
        } else if (this.assetsPackType === 'bought') {
          pageAssetPacksIds = await paginateBoughtAssetPacks(1, this.showPerPage, this.userAddress);     
        }
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
      let pageAssetPacksIds;
      if (this.assetsPackType === 'created') {
        pageAssetPacksIds = await paginateCreatedAssetPacks(currentPage, this.showPerPage, this.userAddress);
      } else if (this.assetsPackType === 'bought') {
        pageAssetPacksIds = await paginateBoughtAssetPacks(currentPage, this.showPerPage, this.userAddress);
      }
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
    .pagination-controls {
      flex: 0 0 100%;
    }
  @media screen and (max-width: 767px) {
    flex-direction: column;    
  }
}
</style>