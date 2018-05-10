pragma solidity ^0.4.22;

import "./ImageToken.sol";
import "../AssetManager.sol";


contract DigitalPrintImage is ImageToken {

    struct ImageMetadata {
        bytes32 ipfsHash;
        uint [] assetPacks;
        string author;
        address owner;
        uint timestamp;
    }

    mapping (uint => ImageMetadata) public imageInfo;

    AssetManager assetManager;

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated
    /// @param _ipfsHash to image
    /// @param _assetPacks is array of assetPack id's used in this image creation
    /// @param _author is some kind of nickname for one who created image
    /// @return returns id of created image
    function createImage(bytes32 _ipfsHash, uint[] _assetPacks, string _author) public returns (uint) {

    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {

    }


}