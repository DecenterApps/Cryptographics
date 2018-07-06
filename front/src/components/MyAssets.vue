<template>
    <div class="asset-packs-wrapper">
        <div class="asset-pack" v-for="asset,key in asset_packs_image">
            <img class="asset-pack-image" :src="asset" />

            <div class="asset-meta">
                <div class="asset-description">
                    <span class="asset-thumbnail"></span>
                    <span class="asset-name">YoungSerif</span>
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
      created_assets: [],
      asset_packs_image : [],
      asset_packs_ids: [],
    }),

    props: ['metamask_account'],

    async created() {
      await this.getCreatedAssetPacks();
      await this.generateAssetPacks();
    },

    methods: {
      async getCreatedAssetPacks() {
        this.asset_packs_ids = await functions.getCreatedAssetPacks(this.metamask_account);
      },

      async generateAssetPacks() {
          let hovers = await functions.getHoversForAssetPacks(this.asset_packs_ids);
          console.log(hovers);
          for (let i = 0; i < hovers.length; i++) {
            this.asset_packs_image.push('https://ipfs.decenter.com/ipfs/' + hovers[i]);
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

                .asset-description {

                }
            }
        }
    }

</style>