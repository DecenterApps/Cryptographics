<template>
    <div>
        <input type="file" id="asset"/>
        <input placeholder="Asset price: " v-model="price"/>
        <button @click="createAsset">
            Create asset
        </button>
    </div>
</template>

<script>

    // const util = require('util');
    // const exec = util.promisify(require('child_process').exec);
    import * as imageService from "services/imageService";
    const ipfsService = require('services/ipfsService');

    export default {
        data:  () => ({
            mm :"",
            price: 0,
        }),
        props: ["metamask_account"],

        methods: {
            async createAsset() {
                var file = document.getElementById("asset").files[0];
                var reader = new FileReader();
                let image = "";
                reader.onloadend = async () => {
                    console.log(reader.result);
                    image = reader.result.substr(22);
                    let ipfsHash = await ipfsService.uploadFile(image);
                    console.log(ipfsHash);
                    let asset = await imageService.createAsset(parseInt(this.price,10), ipfsHash, this.metamask_account);
                    console.log(asset);
                };
                if(file){
                    reader.readAsDataURL(file);
                }

            },

            },
    }
</script>

<style scoped>

</style>