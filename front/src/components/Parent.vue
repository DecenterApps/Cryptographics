<template xmlns:display="http://www.w3.org/1999/xhtml">
    <div display:inline-block>
        <label> Metamask account: {{ metamask_account }}</label>
        <div>
            <label> Random seed : {{ random_seed }}</label>
        </div>
        <div>
            <label> Timestamp : {{ timestamp }}</label>
        </div>
        <div>
            <canvas-image v-if="id_to_show==-1" :objs="objs"></canvas-image>
        </div>
        <div>
            <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
        </div>
        <div>
            <button @click="buyImage"> Buy this assets and save image on chain for {{ image_price }}</button>
        </div>
        <div>
            <input placeholder="Type potential assets you'd like splited with comma" v-model="potential_assets"/>
        </div>
        <div>
            <label> Price : {{ image_price }}</label>
        </div>

        <div>
            <packs v-if="allAssets" :allAssets="allAssets"></packs>
        </div>
        <div>
            <button @click="getImages">
                View my image ids
            </button>
        </div>
        <div>
             <label> My images : {{ this.my_images }}</label>
        </div>

        <div>
            <button @click="renderMyImagesCanvas">
                Show my image with id :
            </button>
            <input placeholder="Type id of your image: " v-model="id_to_show"/>
        </div>

        <div>
            <button @click="getBoughtAssets">
                View my assets
            </button>
        </div>

        <div>
            <label> Assets I've bought permission for : {{ this.bought_assets }}</label>
        </div>
        <div>
            <input type="checkbox" id="checkbox" v-model="checked">
            <label for="checkbox"> Pick only assets I've already bought permission for</label>
        </div>

        <canvas-my-images v-if="id_to_show!=-1" :myobjects="myobjects" ></canvas-my-images>

        <button v-if="id_to_show != -1" @click="hide"> Hide </button>
    </div>

</template>

<script>
    import Packs from './Packs.vue';
    import Canvas from './Canvas.vue';
    import MyImages from './MyImages.vue';

    const methods = require("../methods.js");
    const utils = require("../../scripts/utils.js");
    const functions = require("../../scripts/functions.js");
    export default {
        data: () => ({
            id_to_show : -1,
            checked: false,
            bought_assets: [],
            my_images: [],
            image_price: 0,
            metamask_account: 0,
            objs: [],
            myobjects: [],
            timestamp: new Date().getTime(),
            allAssets: [],
            iterations: 0,
            random_seed: 0,
            potential_assets: [],
            random_hash_ids: functions.pickTenRandoms(),
        }),
        components: {
            'canvas-image': Canvas,
            'canvas-my-images': MyImages,
            'packs': Packs,
        },
        methods: {
            async renderCanvas() {
                let pot;
                if (this.checked == true) {
                    this.potential_assets = this.bought_assets;
                    console.log(this.potential_assets);
                    console.log(this.bought_assets);
                    pot = this.potential_assets;
                } else {
                    pot = this.potential_assets.split(',').map(a => parseInt(a, 10));
                }
                console.log(pot);
                this.objs = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.allAssets);
                this.iterations++;
                let picked = [];
                for (let i = 0; i < this.objs.length; i++) {
                    picked.push(this.objs[i].id);
                }
                let price = await functions.calculatePrice(picked, this.metamask_account);
                if (pot.length == 0) {
                    this.image_price = 0;
                }
                this.image_price = parseInt(price, 10);
            },

            async renderMyImagesCanvas() {
                this.id_to_show = parseInt(this.id_to_show,10);

                if(this.id_to_show === -1) {
                    return;
                }

                let data = await functions.getImageMetadataFromContract(this.id_to_show);
                this.myobjects = await methods.getData(data[0], parseInt(data[1], 10), data[2], this.allAssets);


            },

            async hide() {
                this.id_to_show = -1;
            },

            async buyImage() {
                let pot;
                if (this.checked == true) {
                    this.potential_assets = this.bought_assets;
                    console.log(this.potential_assets);
                    console.log(this.bought_assets);
                    pot = this.potential_assets;
                } else {
                    pot = this.potential_assets.split(',').map(a => parseInt(a, 10));
                }
                console.log("RANDOM HASHES: " + this.random_hash_ids);
                console.log("TIMESTAMP: " + this.timestamp);
                console.log("ITERATIONS: " + this.iterations);
                console.log("POTENTIAL ASSETS: " + pot);
                console.log("MM ACCOUNT: " + this.metamask_account);
                let img = await methods.createImage(this.random_hash_ids, `${this.timestamp}`, `${this.iterations - 1}`, pot, "Madjar", this.metamask_account, this.image_price);
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
            this.bought_assets = await this.getBoughtAssets();
            this.my_images = await this.getImages()
            this.random_seed = await functions.calculateFirstSeed(this.timestamp, this.random_hash_ids);
            this.renderCanvas();
            // let rs = this.random_seed.toString()
            // rs = rs.substr(0,rs.length - 4);
            // rs = rs.substr(0,1) + rs.substr(2,rs.length);
            // console.log(rs)
            // this.random_seed = await functions.convertSeed(rs)
        },
        watch: {
            potential_assets: async function () {
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
        margin-left: 30px;
        margin-right: 30px;
    }

    canvas {
        display: inline-block;
        position: relative;
        left: 200px;
        background-color: #d6bf63;
    }

    label {
        margin-left: 30px;
    }

    div {
        margin-bottom: 20px;
    }


</style>