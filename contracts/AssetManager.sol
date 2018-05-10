pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";


contract AssetManager is Ownable {


    struct Asset {
        uint id;
        address creator;
        bytes32 ipfsHash;
        uint assetPackId;
        bool isInPack;
        uint layer;
        uint timestamp;
    }

    struct AssetPack {
        uint id;
        address owner;
        uint price;
        uint [] assets;
        uint timestamp;
    }

    Asset [] assets;
    AssetPack [] assetPacks;

    mapping (uint => address) assetIdToOwner;
    mapping (uint => address) assetPackIdToOwner;
    mapping (address => uint []) allAssetBought;
    mapping (address => uint []) allAssetPackBought;


    /// Every assetPack can contain maximum 50 assets - can be changed
    uint ASSET_PACK_LENGTH = 50;


    /// @notice Function which creates an asset
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender and assetPackId will not be set initially
    /// @dev if there is isInPack atribute true that means asset is used in an assetPack already
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _layer is level of priority in image representation of that asset
    function createAsset(bytes32 _ipfsHash, uint _layer) public {

    }

    /// @notice Function which is going to edit an existing asset
    /// @dev asset can be only edited if still isn't in any assetPack, only owner of assetPack can edit assetPack
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _layer is level of priority in image representation of that asset
    function editAsset(bytes32 _ipfsHash, uint _layer) public {

    }


    /// @notice Function which alows user to create assetPack
    /// @dev assetPack is created and added to array of assetPacks, once it's created, can't be deleted or edited
    /// @param _price is price of that assetPack
    /// @param _assets is array of asset id's which will contain that assetPack - all assets isInPack in _assets MUST be false, and after calling this method will be true
    function createAssetPack(uint _price, uint [] _assets) public {

    }

    /// @notice Function to buy assetPack - all assetPacks are on sale.
    /// @dev If transaction is successful msg.sender gets access to all assets in that pack
    /// @param _assetPackId is id of assetPack we are buying
    function buyAssetPack(uint _assetPackId) public payable {

    }

    /// @notice Function which is going to check if an address can use an asset
    /// @dev just compare mappings, but will be cleaner code
    /// @param _address is address for which we would like to check permision
    /// @param _assetId is id of asset we'd like to check
    function checkPermision(address _address, uint _assetId) public view {

    }



}