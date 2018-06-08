<template>
    <div>
        <label> {{ metamask_account }}</label>
        <canvas-image :objs="objs" ></canvas-image>
        <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
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
                let price = await functions.calculatePrice(picked,"0xf67cDA56135d5777241DF325c94F1012c72617eA");
                this.image_price = parseInt(price,10);
            },

        },
        async beforeCreate() {
            let getWeb3 = new Promise(function (resolve, reject) {
                // Check for injected web3 (mist/metamask)
                var web3js = window.web3
                if (typeof web3js !== 'undefined') {
                    var web3 = new Web3(web3js.currentProvider)
                    resolve({
                        injectedWeb3: web3.isConnected(),
                        web3 () {
                            return web3
                        }
                    })
                } else {
                    reject(new Error('Unable to connect to Metamask'))
                }
            })
                .then(result => {
                    return new Promise(function (resolve, reject) {
                        // Retrieve network ID
                        result.web3().version.getNetwork((err, networkId) => {
                            if (err) {
                                // If we can't find a networkId keep result the same and reject the promise
                                reject(new Error('Unable to retrieve network ID'))
                            } else {
                                // Assign the networkId property to our result and resolve promise
                                result = Object.assign({}, result, {networkId})
                                resolve(result)
                            }
                        })
                    })
                })
                .then(result => {
                    return new Promise(function (resolve, reject) {
                        // Retrieve coinbase
                        result.web3().eth.getCoinbase((err, coinbase) => {
                            if (err) {
                                reject(new Error('Unable to retrieve coinbase'))
                            } else {
                                result = Object.assign({}, result, { coinbase })
                                resolve(result)
                            }
                        })
                    })
                })
                .then(result => {
                    return new Promise(function (resolve, reject) {
                        // Retrieve balance for coinbase
                        result.web3().eth.getBalance(result.coinbase, (err, balance) => {
                            if (err) {
                                reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
                            } else {
                                result = Object.assign({}, result, { balance })
                                resolve(result)
                            }
                        })
                    })
                });
            this.allAssets = await methods.loadDataForAssets();
            this.random_seed = Math.floor(Math.random()*10000);
            this.renderCanvas();
        },


    }
</script>


<style>


</style>