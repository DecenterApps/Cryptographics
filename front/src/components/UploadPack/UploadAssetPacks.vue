<template>
    <!--<div class="main">-->
            <!--<div class="left-data">-->
                <!--<div class="heading">-->
                    <!--<h1>Upload asset pack</h1>-->
                <!--</div>-->
                <!--<div class="input-data">-->
                    <!--<input class="pack_name" name="pack_name" type="text" placeholder="Asset Pack name"/>-->
                    <!--&lt;!&ndash;<button for="files" class="uploadFiles"> Browse </button>&ndash;&gt;-->
                    <!--<input class="uploadFiles" id="files" type="file" multiple size="50">-->
                <!--</div>-->
                <!--<input class="pack_price" name="price" type="text" placeholder="Value"/>-->
                <!--<div>-->
                    <!--<button @click="uploadAssets"> Upload </button>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<button @click="uploadToIpfs"> Submit </button>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="right-data" v-for="file,key in uploaded_data.paths" style="display: inline-block">-->
            <!--<button @click="remove(key)"> Delete</button>-->
            <!--<img :src="file"/>-->
        <!--</div>-->

    <div>
        <div class="main">
            <div class="left-data">
                <h1> Upload asset pack</h1>
                <div class="input-data">
                    <input class="pack_name" name="pack_name" type="text" placeholder="Asset Pack name"/>
                    <input class="uploadFiles" id="files" type="file" multiple size="50">
                </div>
                <input class="pack_price" name="price" type="text" placeholder="Value"/>
                <div class="number_of_assets">
                    <label> Assets in pack 15-20 </label>
                </div>

                <div class="btns">
                    <button class="submit" @click="uploadToIpfs"> Submit </button>
                    <button class="try" @click="uploadAssets"> Try </button>
                </div>
            </div>

            <div class="right-data">
                <div class="image" v-for="file,key in uploaded_data.paths" style="display: inline-block">
                    <img :src="file"/>
                    <button class="background" @click="setBackground(key)" > Set background </button>
                    <button class="delete" @click="remove(key)"> Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IPFS from 'ipfs';
    import * as ipfsService from '../../../scripts/ipfsService.js';
    import {getAccounts} from "../../../scripts/helpers";
    import {createAssetPack} from "../../methods";
    import * as utils from "../../../scripts/utils";

    export default {
        name: "upload-asset-packs",
        data: () => ({
            metamask_account: 0,
            uploaded_data: {
                paths : [],
                files : [],
            },
            attributes: [],
        }),

        methods: {
            uploadAssets() {
              let x = document.getElementById("files");
              let urls =[];
              let files = [];
              for(let i=0; i<x.files.length; i++) {
                  files.push(x.files[i]);
                  urls.push(URL.createObjectURL(x.files[i]));
              }
              this.uploaded_data.paths = [...this.uploaded_data.paths, ...urls];
              this.uploaded_data.files = [...this.uploaded_data.files, ... files];
              for(let j=0; j< this.uploaded_data.files.length; j++) {
                  this.attributes.push(222);
              }
            },

            async uploadToIpfs() {
                let hashes =[];
                let counter = this.uploaded_data.files.length;
                const price = document.querySelector("input[name=price]").value;
                const name = document.querySelector("input[name=pack_name").value;
                const that = this;
                for(let i=0; i<this.uploaded_data.files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = async function(event) {
                      let ipfsHash = await ipfsService.uploadFile(event.target.result.substr(22));
                      hashes.push(utils.getBytes32FromIpfsHash(ipfsHash));
                      counter--;
                      if (counter === 0) {
                          console.log(hashes);
                          console.log(price);
                          await createAssetPack(name, that.attributes, hashes, price, that.metamask_account);
                      }
                    };
                    reader.readAsDataURL(this.uploaded_data.files[i]);
                }
            },

            remove(key) {
              this.uploaded_data.paths.splice(key,1);
              this.uploaded_data.files.splice(key,1);
            },

            setBackground(key) {
              this.attributes[key] = 100 + this.attributes[key] %100;
            }
        },

        async beforeCreate() {
            this.metamask_account = await getAccounts();
            console.log(this.metamask_account);
            window.node = new IPFS({
                repo: 'cryptographics',
                config: {
                    Bootstrap: ipfsService.bootstrapNodes,
                    Addresses: {
                        Swarm: [],
                    },
                }
            });
        },

    }
</script>

<style scoped>
    div.number_of_assets {
        margin-top: 17px;
    }

    label {
        font-size: 12px;
        font-family: 'Roboto', regular;

    }
    div.input-data {
        margin-top: 26px;
        display: flex;
    }
    input {
        border-radius: 5px;
        background-color: #D9D9D9;

    }
    input.pack_name {
        width: 209px;
        height: 33px;
    }

    input.pack_price {
        margin-top: 15px;
        width: 92px;
        height: 33px;

    }

    input.uploadFiles {
        padding-left: 20px;
    }

    button.uploadFiles {
        border-radius: 5px;
        width: 89px;
        height: 33px;
        margin-left: 20px;
    }
    img {
        border-radius: 20px;
        width: 206px;
        height: 206px;
        margin-right: 20px;
        margin-bottom: 20px;
    }

    div.image:hover img {
        opacity: 0.5;
    }
    div.image:hover button.delete {
        display: block;
    }
    div.image:hover button.background {
        display: block;
    }
    button.background {
        display: none;
    }
    button.delete {
        display: none;
    }

    h1 {
        font-family: 'YoungSerif-Regular', sans-serif;
        font-size: 32px;
    }
    div.left-data {
        padding-left: 166px;
        padding-top: 82px;
        float: left;

    }

    div.right-data {
        padding-left: 20px;
        padding-top: 93px;
        overflow-y: auto;
        height: 500px;
    }
    div.main {
        height: 100vh;
        background-color: #D9D9D9;
        display: flex;
    }

    div.btns {
        padding-top: 124px;
    }

    button {
        width: 89px;
        height: 33px;
        border-radius: 5px;
    }
    button.submit {
        background-color: black;
        color: white;
    }
    button.try {
        margin-left: 5px;
    }

</style>