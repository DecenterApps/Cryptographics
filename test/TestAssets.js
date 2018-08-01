const AssetManager = artifacts.require("../contracts/AssetManager.sol");
const utils = require('../frontend/src/services/utils');
const Web3 = require('web3');

contract('AssetManager', async (accounts) => {

    let assetManager;

    before(async () => {
        assetManager = await AssetManager.deployed();
    });

    it("...Should create assets", async () => {
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

        let numOfAssets = await assetManager.getNumberOfAssets();
        let numOfPacks = await assetManager.getNumberOfAssetPacks();
        
        assert.equal(numOfAssets, 80, "Number of assets should be 80");
        assert.equal(numOfPacks, 4, "Number of packs should be 4");
    });
});