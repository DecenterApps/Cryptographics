const DigitalPrintImage = artifacts.require("./Image/DigitalPrintImage.sol");

module.exports = function (deployer) {
    deployer.deploy(DigitalPrintImage);
}