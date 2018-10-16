const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Marketplace = artifacts.require("./Marketplace");
const Functions = artifacts.require("./Functions.sol");
const CryptographicsGetter = artifacts.require("./CryptographicsGetter.sol");

module.exports = function(deployer) {
    deployer.then(async () => {    
        await deployer.deploy(AssetManager);
        let assetManager = await AssetManager.deployed();

        await deployer.deploy(Functions);
        let functions = await Functions.deployed();
        
        await deployer.deploy(DigitalPrintImage);
        let dpm = await DigitalPrintImage.deployed();
        
        await deployer.deploy(Marketplace, dpm.address);
        let marketplace = await Marketplace.deployed();
        
        await deployer.deploy(CryptographicsGetter, assetManager.address, dpm.address, functions.address);

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
