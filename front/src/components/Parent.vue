<template>
    <div>
        <label> Metamask account: {{ metamask_account }}</label>
        <canvas-image :objs="objs" ></canvas-image>
        <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
        <button> Buy this assets and save image on chain for {{ image_price }}</button>
        <input v-model = "potential_assets"/>
        <label> Price : {{ image_price }}</label>

    </div>

</template>

<script>
    import Canvas from './Canvas.vue';
    const methods = require("../methods.js");
    const utils = require("../../scripts/utils.js");
    const functions = require("../../scripts/functions.js");


    export default {
        data:  () => ({
            image_price: 0,
            metamask_account: 0,
            objs : [],
            allAssets :  [],
            iterations : 0,
            random_seed: 0,
            potential_assets: '1, 2, 3, 4, 5',
        }),
        components: {
            'canvas-image': Canvas,
        },
        methods: {
            async renderCanvas() {
                let pot = this.potential_assets.split(',').map(a => parseInt(a,10));
                this.objs = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.allAssets);
                this.iterations++;
                let picked = [];
                for(let i=0; i < this.objs.length; i++){
                    picked.push(this.objs[i].id);
                }
                let price = await functions.calculatePrice(picked,this.metamask_account);
                this.image_price = parseInt(price,10);
            },

        },
        async beforeCreate() {
            window.onload = () => {
                this.metamask_account = web3.eth.accounts[0];
            };
            this.allAssets = await methods.loadDataForAssets();
            this.random_seed = Math.floor(Math.random()*10000);
            this.renderCanvas();
        },


    }
</script>


<style>


</style>