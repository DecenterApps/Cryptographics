const AssetManager = artifacts.require("../contracts/AssetManager.sol");


contract('AssetManager', async(accounts) => {
    let assetManagerContract;

    before(async () => {
        assetManagerContract = await AssetManager.deployed();
    });


    it("... asset can'be created", async () => {
        let ipfsHash = "0x1234567";
        let price = 500;
        let layer = 5; //[0,10]

        await assetManagerContract.createAsset(ipfsHash, price, layer, {from: accounts[0]});

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();

        assert.equal(numberOfAssets, 1, "There'd be only 1 asset");
    });

    it("User didn't buy permission for the asset", async() => {
        let ipfsHash = "0x12345678";
        let price = 500000000000000;
        let layer = 5; //[0,10]


        await assetManagerContract.createAsset(ipfsHash, price, layer, {from: accounts[0]});
        await assetManagerContract.buyAssetPermision(0,{from: accounts[0], value: web3.toWei(0.0005, 'ether')});


        let permission = await assetManagerContract.checkHasPermission(accounts[0], 0);
        assert.equal(permission, true, "No permission")
    });
});