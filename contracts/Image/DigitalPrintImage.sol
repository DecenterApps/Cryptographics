pragma solidity ^0.4.23;

import "./ImageToken.sol";
import "../AssetManager.sol";
import "../Utils/Functions.sol";


contract DigitalPrintImage is ImageToken {

    struct ImageMetadata {
        uint random_seed;
        uint interations;
        bytes32[] potentialAssets;
        uint timestamp;
        string author;
        address owner;
    }

    mapping(uint => bool) seedExists;
    mapping(uint => ImageMetadata) public imageIdToInfo;


    AssetManager assetManager;
    Functions functionsContract;

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated, timestamp will be automatically generated
    /// @dev _txHash and _timestamp together with keccak256 will give us randomSeed for user
    /// @param _randomHashIds is array of random hashes from our array
    /// @param _timestamp is timestamp when image is created
    /// @param _iterations is number of how many times he generated random asset positions until he liked what he got
    /// @param _potentialAssets is set of all potential assets user selected for an image
    /// @param _author is nickname of image owner
    /// @return returns id of created image
    function createImage(uint[] _randomHashIds, uint _timestamp, uint _iterations, bytes32[]  _potentialAssets, string _author) public payable returns (uint) {

    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {
        assetManager = AssetManager(_assetManager);
    }
    /// @notice Function to add functions contract
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _functionsContract is address of Functions contract
    function addFunctionsContract(address _functionsContract) public onlyOwner {
        functionsContract = Functions(_functionsContract);
    }
}