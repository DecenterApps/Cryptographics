<template>
    <div class="asset-packs-wrapper">
        <div class="asset-pack" v-for="asset,key in asset_packs_image">
            <img class="asset-pack-image" :src="asset" />

            <div class="asset-meta">
                <div class="asset-description">
                    <span class="asset-thumbnail"></span>
                    <span class="asset-name">{{ asset_packs_names[key] }}</span>
                </div>
                <span class="asset-owned">owner</span>
            </div>
        </div>
    </div>
</template>

<script>

  const functions = require('../../scripts/functions.js');

  export default {
    name: 'my-assets',
    data: () => ({
      asset_packs_names: [],
      asset_packs_image : [],
      asset_packs_ids: [],
      stats_owned: [],
    }),

    props: ['metamask_account','page'],

    async created() {
        if(this.metamask_account){
            await this.getCreatedAssetPacks();
            await this.generateAssetPacks();
        } else {
            await this.getPacks(this.page);
        }
    },

    methods: {
      async getCreatedAssetPacks() {
        this.asset_packs_ids = await functions.getCreatedAssetPacks(this.metamask_account);
      },

      async generateAssetPacks() {
          console.log(this.asset_packs_ids);
          this.asset_packs_names = await functions.getAssetPacksNames(this.asset_packs_ids);
          let hovers = await functions.getHoversForAssetPacks(this.asset_packs_ids);
          for (let i = 0; i < hovers.length; i++) {
            this.asset_packs_image.push('https://ipfs.decenter.com/ipfs/' + hovers[i]);
        }
      },

      async getPacks(page) {
          let ids =[];
          let numberOfPacks = await functions.getNumberOfAssetPacks();
          for(let i=(page-1)*4; i<page*4; i++) {
              if(i<numberOfPacks) {
                ids.push(i);
              }
          }
          console.log(ids);
          this.asset_packs_names = await functions.getAssetPacksNames(ids);
          let hovers = await functions.getHoversForAssetPacks(ids);
          for (let i = 0; i < hovers.length; i++) {
              this.asset_packs_image.push('https://ipfs.decenter.com/ipfs/' + hovers[i]);
          }

          this.stats_owned = await functions.getOwnedAssetsFromPacks(ids);
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

                .asset-description {

                }
            }
        }
    }

</style>