pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";


contract AssetManager is Ownable {

    struct Asset {
        uint id;
        address creator;
        string ipfsHash;
        uint price;
        uint layer;
    }


    uint numberOfAssets;
    mapping(uint => Asset) idToAssetInfo;
    Asset [] assets;


    constructor() public {
        numberOfAssets = 0;
    }


    mapping(address => mapping(uint => bool)) hasPermission;
    mapping(string => bool) hashExists;


    /// @notice Function which creates an asset
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of asset
    /// @param _layer is level of priority in image representation of that asset
    function createAsset(string _ipfsHash, uint _price, uint _layer) public {
        require(hashExists[_ipfsHash] == false);

        assets.push(Asset({
            id : numberOfAssets,
            creator : msg.sender,
            ipfsHash : _ipfsHash,
            price : _price,
            layer : _layer
        }));
        idToAssetInfo[numberOfAssets] = assets[numberOfAssets];
        hashExists[_ipfsHash] = true;
        numberOfAssets++;
    }


    /// @notice Function where user can buy himself a permision to use an asset
    /// @dev msg.value will be sent to asset creator
    /// @param _assetId is id of asset user wants to buy
    function buyAssetPermision(uint _assetId) public payable {
        require(msg.value >= assets[_assetId].price);

        hasPermission[msg.sender][_assetId] = true;
        assets[_assetId].creator.transfer(msg.value);
    }

    function getNumberOfAssets() public view returns (uint) {
        return numberOfAssets;
    }

    /// @notice Function to check have user bought permission for an asset
    /// @param _address is address of user
    /// @param _assetId is id of asset
    function checkHasPermission(address _address, uint _assetId) public view returns (bool){
        return hasPermission[_address][_assetId];
    }

    /// @notice Function to check does hash exist in mapping
    /// @param _ipfsHash is string representation of hash
    function checkHashExists(string _ipfsHash) public view returns (bool){
        return hashExists[_ipfsHash];
    }

    /// @notice Method to get all info for an asset
    /// @param id is id of asset
    /// @return All data for an asset
    function getAssetInfo(uint id) public view returns (uint, address, string, uint, uint){
        require(id >= 0);
        require(id < numberOfAssets);
        Asset storage asset = idToAssetInfo[id];

        return (asset.id, asset.creator, asset.ipfsHash, asset.price, asset.layer);
    }


    /// @notice Method to get price of asset
    /// @param id is id of asset
    /// @return price of asset
    function getAssetPrice(uint id) public view returns (uint){
        require(id >= 0);
        require(id < numberOfAssets);

        Asset storage asset = idToAssetInfo[id];

        return asset.price;
    }
}