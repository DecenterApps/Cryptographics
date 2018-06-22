<template>
    <div class="glavni">
        <h3> My profile </h3>
        <div>
            <div>
                <label> Metamask account : {{this.metamask_account}}</label>
            </div>
            <div>
                <label> My bought assets : {{this.bought_assets}}</label>
            </div>
            <div>
                <label> Assets I've created: {{this.created_assets}}</label>
            </div>
            <div>
                <label> My images on chain: {{this.my_images_on_chain}}</label>
            </div>
            <div>
                <button @click="generateData"> Generate data </button>
            </div>
            <!--<div v-for="image  in  my_images_on_chain " :key="image">{{image}}-->
                <!--&lt;!&ndash;<canvas-my-images :props="[image, allAssets]"></canvas-my-images>&ndash;&gt;-->
            <!--</div>-->
            <div>
                <button @click="renderMyImagesCanvas"> View image </button>
                <input placeholder="Type id of your image: " v-model="id_to_show"/>
            </div>
            <!--<div >-->
                <!--<div class="asets" v-for="(asset,key) in allAssetPaths">-->
                    <!--<label> {{key}}</label>-->
                    <!--<img :src=asset>-->
                <!--</div>-->
            <!--</div>-->
            <canvas-my-images v-if="id_to_show!=-1" :myobjects="myobjects"></canvas-my-images>
        </div>
    </div>
</template>

<script>



    const functions = require("../../scripts/functions.js");
    const methods = require("../methods.js");

    import MyImages from './MyImages.vue';

    export default {
        name: "my-profile",
        data: () => ({
            allAssetPaths: [],
            id_to_show: -1,
            metamask_account: 0,
            allAssets: [],
            my_images_on_chain: [],
            bought_assets: [],
            created_assets: [],
            myobjects: [],
        }),
        components: {
            'canvas-my-images': MyImages,
        },
        computed: {
            async generateData() {
                await this.getImages();
                await this.getCreatedAssets();
                await this.getBoughtAssets();
                await this.getAllAssets();
            },
        },
        methods: {
            async getImages() {
                this.my_images_on_chain = await functions.getUserImages(this.metamask_account);
            },

            async getCreatedAssets() {
                this.created_assets = await functions.getAssetsUserCreated(this.metamask_account);
            },

            async getBoughtAssets() {
                this.bought_assets = await functions.getBoughtAssets(this.metamask_account);
                this.bought_assets = this.bought_assets.sort(function(a, b){return a - b})
            },

            async getAllAssets() {
                this.allAssets = await methods.loadDataForAssets();

            },

            async renderMyImagesCanvas() {
                if(this.id_to_show == -1) {
                    return;
                }
                let found = false;
                for(let i=0; i<this.my_images_on_chain.length; i++){
                    if(this.my_images_on_chain[i] == this.id_to_show){
                        found = true;
                    }
                }

                if(!found){
                    this.id_to_show = -1;
                    return;
                }
                let data = await functions.getImageMetadataFromContract(this.id_to_show);
                this.myobjects = await methods.getData(data[0], parseInt(data[1], 10), data[2], this.allAssets);
            },
        },


        async beforeCreate() {
            window.onload = () => {
                web3.eth.getAccounts((err, acc) => {
                    if (err) return console.error(err);
                    this.metamask_account = acc[0];
                });
            };

        }




    }

</script>

<style scoped>
    img{
        margin-right: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100px;
        height: 100px;
    }
    label {
        position: relative;
        padding-left: 500px;
        font-size: 28px;
    }
    div.glavni{
        height: 100vh;
    }
    h3{
        padding-left: 500px;
        font-size: 35px;

    }
    div.asets{
        display: inline-block;
    }

    button {
        margin-top: 20px;
        width: 350px;
        margin-left: 500px;
    }


</style>