const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");

module.exports = function (deployer) {
    deployer.deploy(AssetManager);
    deployer.deploy(DigitalPrintImage)
        .then((digitalPrintImage) => digitalPrintImage.addAssetManager(AssetManager.address))
        .then(() => true);

}nanonano