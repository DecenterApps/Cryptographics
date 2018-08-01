const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("../contracts/AssetManager.sol");
const utils = require('../frontend/src/services/utils');
const Web3 = require('web3');
const advanceToBlock = require('./helpers/advanceToBlock').advanceToBlock;

contract('DigitalPrintImage', async (accounts) => {

    let dpm, assetManager;

    before(async () => {
        dpm = await DigitalPrintImage.deployed();
        assetManager = await AssetManager.deployed();
    
        await advanceToBlock(200);

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
        // console.log("start");
        let seed = await dpm.calculateSeed([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 123213);
        // console.log(seed);
        let final = await dpm.getFinalSeed(seed, 1);
        // console.log(final);
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

    it("...Should be able to change username multiple times and to use old usernames", async () => {
        let username;
        
        await dpm.register("Nikola", "0x0");
        username = await dpm.getUsername(accounts[0]);

        assert.equal(username, "Nikola", "Username should change to Nikola");

        await dpm.register("Jovan", "0x0");
        username = await dpm.getUsername(accounts[0]);

        assert.equal(username, "Jovan", "Username should be Jovan");

        await dpm.register("Nikola", "0x0");
        username = await dpm.getUsername(accounts[0]);

        assert.equal(username, "Nikola", "Should be able to use his old username Nikola");
    });

    it("...Should be able to change only picture", async () => {
        let username;
        
        await dpm.register("Nikola", "0x0");
        username = await dpm.getUsername(accounts[0]);

        assert.equal(username, "Nikola", "Username should change to Nikola");

        await dpm.register("Nikola", "0x1");
        let userInfo = await dpm.getUserInfo(accounts[0]);

        assert.equal(userInfo[0], "Nikola", "Username should be Nikola");
        assert.equal(userInfo[1], "0x1000000000000000000000000000000000000000000000000000000000000000", "Picture has to be 0x1000000000000000000000000000000000000000000000000000000000000000");
    });

});