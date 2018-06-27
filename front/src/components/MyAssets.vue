<template>
    <div>
        <div v-for="asset in assets">
            <img :src="asset" @click="showAssetsInPack"/>
        </div>
    </div>
</template>

<script>

    const functions = require('../../scripts/functions.js');

    export default {
        name: "my-assets",
        data:  () => ({
            created_assets: [],
            assets: [],
        }),

        props: ["metamask_account"],

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
                for(let i=0; i<this.created_assets.length; i+=10){
                    let assetPackIpfs = await functions.getAssetIpfs(this.created_assets[i]);
                    this.assets.push("https://ipfs.decenter.com/ipfs/" + assetPackIpfs);
                }
            }
        }


    }
</script>

<style scoped>
    img {
        width: 250px;
        height: 250px;
    }
</style>