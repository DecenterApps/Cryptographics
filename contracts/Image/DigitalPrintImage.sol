pragma solidity ^0.4.23;

import "./ImageToken.sol";
import "../AssetManager.sol";


contract DigitalPrintImage is ImageToken {

    struct ImageMetadata {
        uint random_seed;
        uint interations;
        bytes32 potentialAssets;
        uint timestamp;
        string author;
        address owner;
    }

    bytes32[] randomHashes;

    constructor() public {
        for(uint i = block.number - 101; i < block.number; i++){
            randomHashes.push(blockhash(i));
        }
    }
    mapping (uint => bool) seedExists;
    mapping (uint => ImageMetadata) public imageIdToInfo;

    AssetManager assetManager;

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated, timestamp will be automatically generated
    /// @dev _txHash and _timestamp together with keccak256 will give us randomSeed for user
    /// @param _random_seed is random seed
    /// @param _iterations is number of how many times he generated random asset positions until he liked what he got
    /// @param _potentialAssets is set of all potential assets user selected for an image
    /// @param _author is nickname of image owner
    /// @return returns id of created image
    function createImage(uint _random_seed, uint _iterations, bytes32 _potentialAssets, string _author) public returns (uint) {
        require(seedExists[_random_seed] == false);

    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {
        assetManager = AssetManager(_assetManager);
    }


    /// @notice Function that generates random seed based on input of user and timestamp
    /// @dev requiring that length of randomHashIds is 10
    /// @param _randomHashIds is array of id's of random hashes generated during initialization of contract
    /// @param _timestamp is time when user asked for seed
    function calculateSeed(uint[] _randomHashIds, uint _timestamp) public returns (uint){
        require(_randomHashIds.length == 10);
        bytes32 randomSeed = keccak256(randomHashes[_randomHashIds[0]],
            randomHashes[_randomHashIds[1]],randomHashes[_randomHashIds[2]],
            randomHashes[_randomHashIds[3]], randomHashes[_randomHashIds[4]],
            randomHashes[_randomHashIds[5]], randomHashes[_randomHashIds[6]],
            randomHashes[_randomHashIds[7]], randomHashes[_randomHashIds[8]],
            randomHashes[_randomHashIds[9]], _timestamp);
        return uint(randomSeed);
    }




}