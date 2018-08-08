<template>
    <div>
        <div class="images" v-for="(image, index) in images" :key="index">
            <img :src="image"/>
        </div>
    </div>
</template>

<script>

    import * as functions from 'services/ethereumService.js';

    export default {
        data:  () => ({
            images: [],
        }),
        props : ["metamask_account"],

        async created() {
            console.log("mmaccount" + this.metamask_account);
            let my_images_on_chain = await functions.getUserImages(this.metamask_account);
            let prefix = "https://ipfs.decenter.com/ipfs/";
            let images = [];
            for (let i = 0; i < my_images_on_chain.length; i++) {
                let hash = await functions.getImageIpfs(my_images_on_chain[i]);
                images.push(prefix + hash);
            }
            console.log(images);
            this.images = images;
        }

    }
</script>

<style scoped>
    div.images {
        display: inline-block;
    }
    img {
        width: 450px;
        height: 450px;
        margin-left: 20px;
        margin-top: 20px;
        margin-right: 20px;
    }
</style>