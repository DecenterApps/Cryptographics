<template>
    <div>
        <div v-for="image , key in asset_pack_image">
            <label> Asset pack number : {{ key }}</label>
            <img :src="image" @click="showAssetsInPack"/>
        </div>
    </div>
</template>

<script>

    const functions = require('../../scripts/functions.js');

    export default {
        name: "my-assets",
        data:  () => ({
            asset_packs: [],
            created_assets: [],
            asset_pack_image: [],
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
                let arr = [];
                for(let i=1; i<this.created_assets.length; i+=10){
                    if(i<10) {
                        this.asset_pack_image.push("http://localhost:3000/dist/assets/" + "0"+i.toString()+".png");
                    } else {
                        this.asset_pack_image.push("http://localhost:3000/dist/assets/" + i.toString()+".png");
                    }
                    arr.push(this.created_assets.slice(i,i+10));
                }
                this.asset_packs = arr;
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