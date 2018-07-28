const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("../contracts/AssetManager.sol");
const utils = require('scripts/utils.js');
const Web3 = require('web3');

contract('DigitalPrintImage', async (accounts) => {

    let dpm, assetManager;

    before(async () => {
        dpm = await DigitalPrintImage.deployed();
        assetManager = await AssetManager.deployed();
    
        for (let i=0; i<150; i++) {
            await dpm.getLen();
        }

        await dpm.fillWithHashes();

        let ipfsHashes = [];
        let attributes = [];
        for(let i = 0; i<20; i++) {
            ipfsHashes.push(Web3.utils.sha3(i.toString()));
            attributes.push(122);
        }

        await assetManager.createAssetPack("0x0", "Pack 1", attributes, ipfsHashes, 1000);
        for(let i = 0; i<20; i++) {
            ipfsHashes[i] = Web3.utils.sha3((i+20+1).toString());
        }
        await assetManager.createAssetPack("0x0", "Pack 2", attributes, ipfsHashes, 1000);
        for(let i = 0; i<20; i++) {
            ipfsHashes[i] = Web3.utils.sha3((i+40+1).toString());
        }
        await assetManager.createAssetPack("0x0", "Pack 3", attributes, ipfsHashes, 1000);
        for(let i = 0; i<20; i++) {
            ipfsHashes[i] = Web3.utils.sha3((i+60+1).toString());
        }
        await assetManager.createAssetPack("0x0", "Pack 4", attributes, ipfsHashes, 1000);
    });

    
    it("...Should create image if I have access to all packs", async () => {
        let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

        let encoded_arr = utils.encode(arr);
        res = await dpm.decodeAssets(encoded_arr);
        for (let i=0; i<res.length; i++) {
            res[i] = parseInt([i]);
        }
        console.log("start");
        let seed = await dpm.calculateSeed([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 123213);
        console.log(seed);
        let final = await dpm.getFinalSeed(seed, 1);
        console.log(final);
        let new_res = await dpm.createImage([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 123213, 1, encoded_arr, "Author", "hash"); 
        let balance = await dpm.balanceOf(accounts[0]);
        assert.equal(balance, 1, "User should have image he just created");
    });

    it("...Should create image if I don't have access to all packs", async () => {
        let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13];

        let encoded_arr = utils.encode(arr);
        res = await dpm.decodeAssets(encoded_arr);
        for (let i=0; i<res.length; i++) {
            res[i] = parseInt([i]);
        }
        let price = await dpm.calculatePrice(arr, accounts[1]);

        let new_res = await dpm.createImage([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1213, 2, encoded_arr, "New", "ipfsH12ash", {from: accounts[1], value: price}); 
        // console.log(new_res);
        let balance = await dpm.balanceOf(accounts[1]);
        assert.equal(balance, 1, "User should have image he just created with right price");
    });

    // it("...Should create token and put it on sale", async () => {
        
    // });

});