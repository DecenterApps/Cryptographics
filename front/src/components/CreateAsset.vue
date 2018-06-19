<template>
    <div>
        <input placeholder="Path to your asset jpeg/png" v-model="path_to_image"/>
        <input placeholder="Asset price: " v-model="price"/>
        <button @click="createAsset">
            Create asset
        </button>
    </div>
</template>

<script>

    // const util = require('util');
    // const exec = util.promisify(require('child_process').exec);
    const methods = require("../methods.js");

    export default {
        data:  () => ({
            mm :"",
            path_to_image: "",
            price: 0,
        }),
        props: ["metamask_account"],

        methods: {
            async createAsset() {
                // const { stdout, stderr } = await exec('ipfs add -q ' + this.path_to_image);
                // let assetIpfs = stdout.split('\n')[0];
                // console.log(assetIpfs);
                let asset = await methods.createAsset(parseInt(this.price,10), this.path_to_image, this.metamask_account);
                console.log(asset);
            }
        },

    }
</script>

<style scoped>

</style>