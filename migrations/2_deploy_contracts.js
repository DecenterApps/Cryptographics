const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Functions = artifacts.require("./Utils/Functions.sol");

module.exports = function (deployer) {
    deployer.deploy(Functions);
}