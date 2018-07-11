const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Marketplace = artifacts.require("./Marketplace");

module.exports = function (deployer) {
    deployer.deploy(AssetManager)
        .then(() => deployer.deploy(DigitalPrintImage))
        .then((digitalPrintImage) => digitalPrintImage.addAssetManager(AssetManager.address))
        .then(() => DigitalPrintImage.deployed())
        .then((digitalPrintImage) => digitalPrintImage.fillWithHashes())
        .then(() => true);
};
