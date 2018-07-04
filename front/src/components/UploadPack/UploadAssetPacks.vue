<template>
    <div>
        <div class="left-data">
            <div class="heading">
                <h1>Upload asset pack</h1>
            </div>
            <div class="input-data">
                <input class="pack_name" name="pack_name" type="text" placeholder="Asset Pack name"/>
                <!--<button for="files" class="uploadFiles"> Browse </button>-->
                <input class="uploadFiles" id="files" type="file" multiple size="50">
            </div>
            <input class="pack_price" name="price" type="text" placeholder="Value"/>
            <div>
                <button @click="uploadAssets"> Upload </button>
            </div>
            <div>
                <button @click="uploadToIpfs"> Submit </button>
            </div>
        </div>
        <!--<div class="right-data" v-for="file,key in uploaded_data.paths" style="display: inline-block">-->
            <!--<button @click="remove(key)"> Delete</button>-->
            <!--<img :src="file"/>-->
        <!--</div>-->
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
                          await createAssetPack(name, hashes, price, that.metamask_account);
                      }
                    };
                    reader.readAsDataURL(this.uploaded_data.files[i]);
                }
            },

            remove(key) {
              this.uploaded_data.paths.splice(key,1);
              this.uploaded_data.files.splice(key,1);
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
    div.heading {
        font-family: 'YoungSerif-Regular', sans-serif;
        font-size: 32px;
        margin-left: 166px;
        margin-top: 82px;
    }

    div.input-data {
        margin-top: 26px;
        margin-left: 166px;
    }
    input {
        border-radius: 5px;
    }
    input.pack_name {
        width: 209px;
        height: 33px;
    }

    input.pack_price {
        margin-top: 15px;
        margin-left: 166px;
        width: 92px;
        height: 33px;

    }

    input.uploadFiles {
    }

    button.uploadFiles {
        border-radius: 5px;
        width: 89px;
        height: 33px;
        margin-left: 20px;
    }
    img {
        border-radius: 20px;
        width: 250px;
        height: 250px;
    }

</style>