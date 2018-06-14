const AssetManager = artifacts.require("../contracts/AssetManager.sol");


contract('AssetManager', async(accounts) => {
    let assetManagerContract;

    before(async () => {
        assetManagerContract = await AssetManager.deployed();
    });


    it("... should create an asset", async () => {
        let ipfsHash = "0x1234567";
        let price = 500;

        await assetManagerContract.createAsset(ipfsHash, price,  {from: accounts[0]});

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();

        assert.equal(numberOfAssets, 1, "There'd be only 1 asset");
    });

    it("... user should have bought permission for asset", async() => {
        let ipfsHash = "0x12345678";
        let price = 500000000000000;


        await assetManagerContract.createAsset(ipfsHash, price, {from: accounts[0]});
        await assetManagerContract.buyAssetPermision(0,{from: accounts[0], value: web3.toWei(0.0005, 'ether')});


        let permission = await assetManagerContract.checkHasPermission(accounts[0], 0);
        assert.equal(permission, true, "User had to have permission for this asset")
    });



});