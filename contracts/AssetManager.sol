pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";


contract AssetManager is Ownable {


    struct Asset {
        uint id;
        address creator;
        bytes32 ipfsHash;
        uint price;
        uint layer;
        uint timestamp;
    }


    Asset [] assets;

    mapping (uint => address) assetIdToCreator;
    /// Array of bought assets for every user will be sorted, so we will always add new asset using binary search
    mapping (address => uint []) allAssetBought;


    /// @notice Function which creates an asset
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of asset
    /// @param _layer is level of priority in image representation of that asset
    function createAsset(bytes32 _ipfsHash, uint _price, uint _layer) public {

    }

    /// @notice Function which is going to edit an existing asset
    /// @dev Only asset creator can call this function
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of this asset
    /// @param _layer is level of priority in image representation of that asset
    function editAsset(bytes32 _ipfsHash, uint _price, uint _layer) public {

    }
    /// @notice Function where user can buy himself a permision to use an asset
    /// @dev msg.value will be sent to asset creator
    /// @param _assetId is id of asset user wants to buy
    function buyAssetPermision(uint _assetId) public payable {

    }

    /// @notice Function which is going to check if an address can use an asset
    /// @dev just compare mappings, but will be cleaner code
    /// @param _address is address for which we would like to check permision
    /// @param _assetId is id of asset we'd like to check
    function checkPermission(address _address, uint _assetId) private view {

    }





}