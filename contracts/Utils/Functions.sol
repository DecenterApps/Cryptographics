pragma solidity ^0.4.23;

contract Functions {

    bytes32[] randomHashes;

    constructor() public {
        for(uint i = block.number - 100; i < block.number; i++){
            randomHashes.push(blockhash(i));
        }
    }
    /// @notice Function for test purposes because in local rpc can't get last 100 blocks
    function fillRadnomHashes() public {
        bytes32 initialHash = "0x1234567891011111112131311";
        for(uint i=0; i<100; i++){
            randomHashes.push(keccak256(initialHash,i));
        }
    }

    /// @notice Function which decodes bytes32 to array of integers
    /// @param _potentialAssets are potential assets user would like to have
    /// @return array of assetIds
    function decodeAssets(bytes32[] _potentialAssets) public view returns (uint[]) {
        uint[] memory assets = new uint[](_potentialAssets.length*10);
        uint numberOfAssets = 0;
        for(uint j=0; j<_potentialAssets.length; j++){
            uint input;
            bytes32 pot = _potentialAssets[j];
            assembly {
                input := pot
            }
            for(uint i=0;i<10;i++){
                uint mask = (2 << (i * 24)) / 2;
                uint b = (input & (mask * 16777215)) / mask;
                if(b!=0) {
                    assets[numberOfAssets] = b;
                    numberOfAssets++;
                }
            }
        }
        uint[] memory ass = new uint[](numberOfAssets);
        for(uint z=0; z< numberOfAssets; z++){
            ass[z] = assets[z];
        }
        return ass;
    }
    /// @notice Function to pick random assets from potentialAssets array
    /// @param _random_seed is random seed at that moment
    /// @param _potentialAssets is bytes32[] array of potential assets
    /// @return uint[] array of randomly picked assets
    function pickRandomAssets(uint _random_seed, bytes32[] _potentialAssets) public view returns(uint[]) {
        uint[] memory assetIds = decodeAssets(_potentialAssets);
        uint[] memory pickedIds;
    }

    function calculateSeed(uint[] _randomHashIds, uint _timestamp) public view returns (uint){
        require(_randomHashIds.length == 10);
        bytes32 randomSeed = keccak256(randomHashes[_randomHashIds[0]],
            randomHashes[_randomHashIds[1]],randomHashes[_randomHashIds[2]],
            randomHashes[_randomHashIds[3]], randomHashes[_randomHashIds[4]],
            randomHashes[_randomHashIds[5]], randomHashes[_randomHashIds[6]],
            randomHashes[_randomHashIds[7]], randomHashes[_randomHashIds[8]],
            randomHashes[_randomHashIds[9]], _timestamp);
        return uint(randomSeed);
    }


    /// @notice Function to calculate final random seed for user
    /// @param _random_seed is initially given random seed
    /// @param _iterations is number of iterations
    /// @return final seed for user as uint
    function getFinalSeed(uint _random_seed, uint _iterations) public view returns (uint){
        bytes32 finalSeed = bytes32(_random_seed);
        for(uint i=0; i<_iterations; i++){
            finalSeed = keccak256(finalSeed,_iterations);
        }
        return uint(finalSeed);
    }

    /// @notice Function to return image metainfo
    /// @dev we assume random seed is here already generated
//    function getImage(bytes32[] _potentialAssets, uint _randomSeed, uint _iteration) public {
//        uint[] memory assetIds = decodeAssets(_potentialAssets);
//        for(uint i=0; i<_iteration;i++){
//            _randomSeed = uint(keccak256(_randomSeed, _iteration));
//        }
//
//        for(uint j=0; j<assetIds.length; j++){
//            if(_randomSeed%2==0){
//                uint _id = assetIds[j];
//                uint _x = _randomSeed%2450;
//                uint _y = _randomSeed%3250;
//                uint _zoom = _randomSeed%200 + 800;
//                uint _rotation = _randomSeed%360;
//                pickedImages.push(ImageMeta({
//                    id : _id,
//                    x : _x,
//                    y : _y,
//                    zoom : _zoom,
//                    rotation: _rotation
//                    }));
//                idToInfo[images] = pickedImages[images];
//                images++;
//            }
//            _randomSeed = uint(keccak256(_randomSeed,5));
//        }
//
//    }

    function getRandomHash(uint _index) public view returns(bytes32){
        return randomHashes[_index];
    }

    function getLen() public view returns(uint) {
        return randomHashes.length;
    }


}
