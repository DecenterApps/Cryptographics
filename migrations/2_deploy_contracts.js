const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Marketplace = artifacts.require("./Marketplace");
const Functions = artifacts.require("./Functions.sol");

module.exports = function(deployer) {
    deployer.then(async () => {    
        await deployer.deploy(AssetManager);
        await deployer.deploy(Functions);
        await deployer.deploy(DigitalPrintImage);
        let dpm = await DigitalPrintImage.deployed();
        await deployer.deploy(Marketplace, dpm.address);
    
        let functions = await Functions.deployed();
        let marketplace = await Marketplace.deployed();
        let assetManager = await AssetManager.deployed();

        console.log("Add asset manager: ");
        await dpm.addAssetManager(assetManager.address);
        console.log("Add functions: ");
        await dpm.addFunctions(functions.address);
        console.log("Add marketplace: ");
        await dpm.addMarketplaceContract(marketplace.address);
        console.log("Add user manager: ");
        await assetManager.addUserManager(dpm.address);
        console.log("Fill with hashes: ");
        await functions.fillWithHashes();
    });
};
