<template>
    <div class="asset-packs-wrapper">
        <div class="asset-pack" v-for="asset,key in assets">
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
      assets: [],
    }),

    props: ['metamask_account'],

    async created() {
      await this.getCreatedAssets();
      await this.generateAssetPacks();
    },

    methods: {
      async getCreatedAssets() {
        this.created_assets = await functions.getAssetsUserCreated(this.metamask_account);
      },

      async generateAssetPacks() {
        console.log(this.created_assets.length);
        for (let i = 0; i < this.created_assets.length; i += 10) {
          let assetPackIpfs = await functions.getAssetIpfs(this.created_assets[i]);
          this.assets.push('https://ipfs.decenter.com/ipfs/' + assetPackIpfs);
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