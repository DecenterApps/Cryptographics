const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("../contracts/AssetManager.sol");
const Functions = artifacts.require("../contracts/Utils/Functions.sol");
const CryptoGetter = artifacts.require("../contracts/CryptographicsGetter.sol");
const utils = require('../client/src/services/utils');
const Web3 = require('web3');
const advanceToBlock = require('./helpers/advanceToBlock').advanceToBlock;

contract('CryptographicsGetter', async (accounts) => {

    let dpm, assetManager, functions, cryptoGetter;

    before(async () => {
        dpm = await DigitalPrintImage.deployed();
        assetManager = await AssetManager.deployed();
        functions = await Functions.deployed();
        cryptoGetter = await CryptoGetter.deployed();

        try {
            let bt = await functions.randomHashes(0);
            console.log("Already has hashes");
        }
        catch (e) {
            await advanceToBlock(web3.eth.blockNumber + 105);
            await functions.fillWithHashes();
            console.log("Filled with hashes");
        }

        let ipfsHashes = [];
        let attributes = [];
        for(let i = 0; i<40; i++) {
            ipfsHashes.push(Web3.utils.sha3(i.toString()));
            attributes.push(122);
        }

        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0", {"from": accounts[1]});
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0", {"from": accounts[2]});
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0", {"from": accounts[3]});
    });
    
    it("...Should create 20 images if I have access to all packs", async () => {
        let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18];

        let encoded_arr = utils.encode(arr);
        res = await functions.decodeAssets(encoded_arr);
        for (let i=0; i<res.length; i++) {
            res[i] = parseInt([i]);
        }
        // console.log("start");
        let seed = await functions.calculateSeed([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 123213);
        // console.log(seed);
        let final = await functions.getFinalSeed(seed, 1);
        // console.log(final);

        for (let i=0; i<20; i++) {
            let new_res = await dpm.createImage([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 123213+i, 1, encoded_arr, "Author", "hash", "hash"); 
        }

        let balance = await dpm.balanceOf(accounts[0]);
        assert.equal(balance, 20, "User should have image he just created");
    });

    it("...Should get all images user created", async () => {

        await dpm.transferFrom(accounts[0], accounts[1], 0);
        await dpm.transferFrom(accounts[0], accounts[1], 5);
        await dpm.transferFrom(accounts[0], accounts[1], 10);
        let ids = await cryptoGetter.getImagesCreatedByAddress(accounts[0]);

        assert.equal(ids.length, 20, "User should have image he just created");
    });

    it("...Should get all images that used specific asset pack", async () => {
        let ids = await cryptoGetter.getImagesUsingAssetPack(0);

        assert.equal(ids.length, 20, "Should be 20 images using asset pack 0"); 

        let arr = [41,42,43,44,45,46,47,48,49];

        let encoded_arr = utils.encode(arr);
        res = await functions.decodeAssets(encoded_arr);
        for (let i=0; i<res.length; i++) {
            res[i] = parseInt([i]);
        }
        let new_res = await dpm.createImage([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 12321, 1, encoded_arr, "Author", "hash", "hash"); 

        ids = await cryptoGetter.getImagesUsingAssetPack(1);
        assert.equal(ids.length, 1, "Should be 1 image using asset pack 1"); 
    });

    it("...Should count number of creators", async () => {
        let creators = await cryptoGetter.getAllCreators();

        assert.equal(creators.length, 4, "Should be exactly 4 creators");
    });
});