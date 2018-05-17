pragma solidity ^0.4.23;

import "./ImageToken.sol";
import "../AssetManager.sol";


contract DigitalPrintImage is ImageToken {

    struct ImageMetadata {
        bytes32[] _assets;
        string author;
        address owner;
    }

    mapping (uint => ImageMetadata) public imageIdToInfo;

    AssetManager assetManager;

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated
    /// @dev _txHash and _timestamp together with keccak256 will give us randomSeed for user
    /// @param _txHash is hash which is given to user equals to hash of last generated block at that moment
    /// @param _timestamp is time when user asked for random_seed
    /// @param _iterations is number of how many times he generated random asset positions until he liked what he got
    /// @param _assets is bytes array of assets where info about every asset (id,x,y,zoom,rotation) will be encoded
    /// @param _author is nickname of image owner
    /// @return returns id of created image
    function createImage(bytes32 _txHash, uint _timestamp, uint _iterations,
        bytes32 [] _assets, string _author) public returns (uint) {

    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {

    }


    /// @notice Function which is going to decode bytes32 and validate positions of assets, randomnes, and can user use all assets
    /// @param _assets bytes array containing all informations about assets
    /// @return if all requirements were satisfied
    function decodeImageMetadata(bytes32[] _assets) returns (bool) {

    }

    /// @notice Function to validate randomness of an image
    /// @dev function to validate was user able to get assets and their positions
    /// @dev random seed is generated keccak256(_tx_hash,_timestamp)
    /// @dev every iteration does sha(last_random_seed)
    /// @param _tx_hash is hash of last block generated when user asked for randomSeed
    /// @param _timestamp is time when user asked for randomSeed
    /// @param _iterations is number of times user asked for new image
    /// @param _assets is data about assets (Image) user got
    function validateImage(bytes32 _tx_hash, uint _timestamp, uint _iterations, bytes32[] _assets) private view {

    }


    /// @notice Function to generate first seed given to user
    /// @dev
    /// @param _tx_hash is hash of last block generated when user asked for randomSeed
    /// @param _timestamp is time when user asked for randomSeed
    /// @return randomSeed in format of bytes32
    function generateFirstSeed(bytes32 _tx_hash, uint _timestamp) private returns (bytes32){

    }



}