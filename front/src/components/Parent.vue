<template xmlns:display="http://www.w3.org/1999/xhtml">
    <div>
        <label> Metamask account: {{ metamask_account }}</label>
        <div>
            <label> Random seed : {{ random_seed }}</label>
        </div>
        <div>
            <label> Timestamp : {{ timestamp }}</label>
        </div>
        <div>
            <canvas-image :objs="objs" ></canvas-image>
        </div>
        <div>
                <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
                <button @click="buyImage"> Buy this assets and save image on chain for {{ image_price }}</button>
                <input placeholder="Type potential assets you'd like splited with comma" v-model = "potential_assets"/>
                <label> Price : {{ image_price }}</label>
        </div>

        <div>
            <packs v-if="allAssets" :allAssets="allAssets"></packs>
        </div>

        <button @click="getImages">
            View my images
        </button>
        <label> My images : {{ this.my_images }}</label>
        <button @click="getBoughtAssets">
            View my assets
        </button>
        <label> Assets I've bought permission for : {{ this.bought_assets }}</label>
        <input type="checkbox" id="checkbox" v-model="checked">
        <label for="checkbox"> Pick only assets I've already bought permission for</label>

    </div>

</template>

<script>
    import Packs from './Packs.vue';
    import Canvas from './Canvas.vue';
    const methods = require("../methods.js");
    const utils = require("../../scripts/utils.js");
    const functions = require("../../scripts/functions.js");


    export default {
        data:  () => ({
            checked : false,
            bought_assets: [],
            my_images: [],
            image_price: 0,
            metamask_account: 0,
            objs : [],
            timestamp: new Date().getTime(),
            allAssets :  [],
            iterations : -1,
            random_seed: 0,
            potential_assets: "",
            random_hash_ids : functions.pickTenRandoms(),
        }),
        components: {
            'canvas-image': Canvas,
            'packs' : Packs,
        },
        methods: {
            async renderCanvas() {
                let pot;
                if(this.checked == true) {
                    this.potential_assets = this.bought_assets;
                    console.log(this.potential_assets);
                    console.log(this.bought_assets);
                    pot = this.potential_assets;
                } else {
                    pot = this.potential_assets.split(',').map(a => parseInt(a,10));
                }
                this.objs = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.allAssets);
                this.iterations++;
                let picked = [];
                for(let i=0; i < this.objs.length; i++){
                    picked.push(this.objs[i].id);
                    console.log(this.objs[i])

                }
                let price = await functions.calculatePrice(picked,this.metamask_account);
                if (pot.length == 0) {
                    this.image_price = 0;
                }
                this.image_price = parseInt(price,10);
            },

            async buyImage() {
                let pot = this.potential_assets.split(',').map(a => parseInt(a,10));
                console.log("RANDOM HASHES: " + this.random_hash_ids);
                console.log("TIMESTAMP: " + this.timestamp);
                console.log("ITERATIONS: " + this.iterations);
                console.log("POTENTIAL ASSETS: " + pot);
                console.log("MM ACCOUNT: " + this.metamask_account);
                //.map(a => a.toString())
                let img = await methods.createImage(this.random_hash_ids, `${this.timestamp}`, `${this.iterations}`, pot, "Madjar", this.metamask_account, this.image_price);
                console.log(img)
            },
            async getImages() {
                this.my_images = await functions.getUserImages(this.metamask_account);
            },
            async getBoughtAssets() {
                this.bought_assets = await functions.getBoughtAssets(this.metamask_account);
            }
        },
        async beforeCreate() {
            this.random_hash_ids = functions.pickTenRandoms();
            this.timestamp = new Date().getTime();
            window.onload = () => {
                web3.eth.getAccounts((err, acc) => {
                    if (err) return console.error(err);
                    this.metamask_account = acc[0];
                })
            };
            this.allAssets = await methods.loadDataForAssets();
            this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
            this.renderCanvas();
            // let rs = this.random_seed.toString()
            // rs = rs.substr(0,rs.length - 4);
            // rs = rs.substr(0,1) + rs.substr(2,rs.length);
            // console.log(rs)
            // this.random_seed = await functions.convertSeed(rs)
            },

        watch: {
            potential_assets: async function() {
               this.iterations = 0;
               this.timestamp = new Date().getTime();
               this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
               // let rs = this.random_seed.toString()
               // rs = rs.substr(0,rs.length - 4);
               // rs = rs.substr(0,1) + rs.substr(2,rs.length);
               // console.log(rs)
               this.random_seed = await functions.convertSeed(this.random_seed)

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