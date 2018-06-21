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
        </div>
    </div>
</template>

<script>

    const functions = require("../../scripts/functions.js");

    export default {
        name: "my-profile",
        data: () => ({
            metamask_account: 0,
            my_images_on_chain: [],
            bought_assets: [],
            created_assets: [],
        }),

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
            async generateData() {
                await this.getImages();
                await this.getCreatedAssets();
                await this.getBoughtAssets();
            }
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

    button {
        margin-top: 20px;
        width: 350px;
        margin-left: 500px;
    }

</style>