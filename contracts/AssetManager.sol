pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";


contract AssetManager is Ownable {


    struct Asset {
        uint id;
        address creator;
        bytes32 ipfsHash;
        uint price;
        uint layer;
    }

    uint numberOfAssets;
    Asset [] assets;

    constructor() public {
        numberOfAssets = 0;
    }

    mapping (address => mapping(uint => bool)) hasPermission;

    /// @notice Function which creates an asset
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of asset
    /// @param _layer is level of priority in image representation of that asset
    function createAsset(bytes32 _ipfsHash, uint _price, uint _layer) public {
        assets.push(Asset({
            id : numberOfAssets,
            creator : msg.sender,
            ipfsHash : _ipfsHash,
            price : _price,
            layer : _layer
        }));

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

}