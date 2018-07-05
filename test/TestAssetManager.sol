pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AssetManager.sol";
contract TestAssetManager {

    function testCreateAsset() public {
        AssetManager assetManager = AssetManager(DeployedAddresses.AssetManager());
        uint attr = 212;
        uint price = 500;
        uint layer = 5;

        bytes32 ipfsHash = "0x1234567";

        assetManager.createAsset(attr,ipfsHash, price);
        uint numberOfAssets = assetManager.getNumberOfAssets();

        Assert.equal(numberOfAssets, 1,"Asset added successfully");
    }

}
