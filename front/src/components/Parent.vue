<template xmlns:display="http://www.w3.org/1999/xhtml">
    <div display:inline-block>
        <label> Metamask account: {{ metamask_account }}</label>
        <div>
            <canvas-image :objs="objs" ></canvas-image>
        </div>
        <div>
                <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
                <button> Buy this assets and save image on chain for {{ image_price }}</button>
                <input placeholder="Type potential assets you'd like splited with comma" v-model = "potential_assets"/>
                <label> Price : {{ image_price }}</label>

        </div>
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
            potential_assets: "",
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

        watch: {
            potential_assets: function(){
               this.iterations = 0;
            }
        }


    }
</script>


<style>
    button {
        margin-left: 30px;
        margin-right: 30px;
        width: 500px;
        height: 30px;
    }
    input {
        width: 500px;
        height: 30px;
    }

    canvas {
        display:inline-block;
        position: relative;
        left: 200px;
        background-color: #d6bf63;
    }

    div {

    }



</style>