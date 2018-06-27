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
            <input placeholder="Type potential assets you'd like splited with comma" v-model="potential_assets" />
        </div>
        <div>
            <label> Price : {{ image_price }}</label>
        </div>

        <div>
            <button @click="getImages">
                View my image ids
            </button>
            <label> My images : {{ this.my_images }} </label>

        </div>

        <div>
            <button @click="getBoughtAssets">
                View assets I've bought
            </button>
            <label> {{ this.bought_assets }}</label>
        </div>
        <div>
            <button @click="getCreatedAssets">
                View assets I've created
            </button>
            <label> {{this.created_assets}}</label>
        </div>

        <div>
            <input type="checkbox" id="checkbox" v-model="checked">
            <label for="checkbox"> Pick only assets I've already bought permission for</label>
        </div>
        <button v-if="id_to_show != -1" @click="hide"> Hide</button>
        <create-asset :metamask_account="metamask_account"></create-asset>
    </div>

</template>

<script>
  import Packs from './Packs.vue';
  import Canvas from './Canvas.vue';
  import MyImages from './MyImages.vue';
  import MyAssets from './AllAssets.vue';
  import CreateAsset from './CreateAsset.vue';

  const methods = require('../methods.js');
  const utils = require('../../scripts/utils.js');
  const functions = require('../../scripts/functions.js');
  const ipfsService = require('../../scripts/ipfsService.js');
  import IPFS from 'ipfs';

  export default {
    data: () => ({
      created_assets: [],
      show_bought_assets: false,
      id_to_show: -1,
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
      'my-assets': MyAssets,
      'create-asset': CreateAsset,
    },
    computed: {},

    methods: {

      async renderCanvas() {
        let pot;

        if (this.checked == true) {
          this.potential_assets = this.bought_assets;
          console.log(this.potential_assets);
          console.log(this.bought_assets);
          pot = this.potential_assets;
        } else {
          if (this.potential_assets.length == 0) {
            pot = [];
            return;
          } else {
            pot = this.potential_assets.split(',').map(a => parseInt(a, 10));
          }
        }
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

      async getCreatedAssets() {
        this.created_assets = await functions.getAssetsUserCreated(this.metamask_account);
      },

      async buyImage() {
        let canvas = Canvas.methods.getCanvasElement();
        let image = canvas.toDataURL('image/png');
        console.log(image);
        let ipfsHash = await ipfsService.uploadFile(image.substr(22));
        let pot;
        if (this.checked == true) {
          this.potential_assets = this.bought_assets;
          console.log(this.potential_assets);
          pot = this.potential_assets;
        } else {
          pot = this.potential_assets.split(',').map(a => parseInt(a, 10));
        }
        console.log('RANDOM HASHES: ' + this.random_hash_ids);
        console.log('TIMESTAMP: ' + this.timestamp);
        console.log('ITERATIONS: ' + this.iterations);
        console.log('POTENTIAL ASSETS: ' + pot);
        console.log('MM ACCOUNT: ' + this.metamask_account);
        let img = await methods.createImage(this.random_hash_ids, `${this.timestamp}`, `${this.iterations - 1}`, pot, 'Madjar', this.metamask_account, this.image_price, ipfsHash);
        console.log(img);
      },
      async getImages() {
        this.my_images = await functions.getUserImages(this.metamask_account);
      },
      async getBoughtAssets() {
        this.bought_assets = await functions.getBoughtAssets(this.metamask_account);
        this.bought_assets = this.bought_assets.sort(function (a, b) {return a - b;});
      }
    },
    async beforeCreate() {
      this.random_hash_ids = functions.pickTenRandoms();
      this.timestamp = new Date().getTime();
      web3.eth.getAccounts((err, acc) => {
        if (err) return console.error(err);
        console.log('account' + acc);
        this.metamask_account = acc[0];
      });
      window.node = new IPFS({
        repo: 'cryptographics',
        config: {
          Bootstrap: ipfsService.bootstrapNodes,
          Addresses: {
            Swarm: [],
          },
        }
      });

      this.iterations = 0;
      this.allAssets = await methods.loadDataForAssets();
      this.bought_assets = await this.getBoughtAssets();
      this.my_images = await this.getImages();
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
        this.random_seed = await functions.convertSeed(this.random_seed);
      }
    }
  };
</script>

<style scoped>
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
        background-color: #ffffff;
    }

    label {
        margin-left: 30px;
    }

    div {
        margin-bottom: 20px;
    }


</style>