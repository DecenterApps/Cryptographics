const AssetManager = artifacts.require("../contracts/AssetManager.sol");
const DigitalPrintImage = artifacts.require("../contracts/DigitalPrintImage.sol");
const utils = require('../client/src/services/utils');
const Web3 = require('web3');

contract('AssetManager', async (accounts) => {

    let assetManager;

    before(async () => {
        assetManager = await AssetManager.deployed();
        dpm = await DigitalPrintImage.deployed();
    });

    it("...Should create assets", async () => {
        let ipfsHashes = [];
        let attributes = [];
        for(let i = 0; i<20; i++) {
            ipfsHashes.push(Web3.utils.sha3(i.toString()));
            attributes.push(122);
        }

        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        await assetManager.createAssetPack("0x0", attributes, ipfsHashes, 1000, "0x0");
        
        let numOfAssets = await assetManager.getNumberOfAssets();
        let numOfPacks = await assetManager.getNumberOfAssetPacks();
        
        assert.equal(numOfAssets, 80, "Number of assets should be 80");
        assert.equal(numOfPacks, 4, "Number of packs should be 4");
    });

    it("...Should have connection to DigitalPrintImage", async () => {
        let userManager = await assetManager.userManager();

        assert.equal(userManager, dpm.address, "Addresses should be equal");
    });
});