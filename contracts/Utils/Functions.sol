pragma solidity ^0.4.23;

contract Functions {

    bytes32[] randomHashes;

    function fillWithHashes() public {
        for(uint i = block.number - 100; i < block.number; i++){
            randomHashes.push(blockhash(i));
        }
    }

    //        /// @notice Function for test purposes because in local rpc can't get last 100 blocks
    //        function fillRadnomHashes() public {
    //            bytes32 initialHash = "0x1234567891011111112131311";
    //
    //            for(uint i=0; i<100; i++){
    //                randomHashes.push(keccak256(initialHash,i));
    //            }
    //        }


    /// @notice Function which decodes bytes32 to array of integers
    /// @param _potentialAssets are potential assets user would like to have
    /// @return array of assetIds
    function decodeAssets(bytes32[] _potentialAssets) public pure returns (uint[]) {
        require(_potentialAssets.length > 0);
        uint[] memory assets = new uint[](_potentialAssets.length*10);
        uint numberOfAssets = 0;

        for(uint j = 0; j<_potentialAssets.length; j++){
            uint input;
            bytes32 pot = _potentialAssets[j];

            assembly {
                input := pot
            }

            for(uint i = 0; i<10; i++){
                uint mask = (2 << (i * 24)) / 2;
                uint b = (input & (mask * 16777215)) / mask;

                if(b!=0) {
                    assets[numberOfAssets] = b;
                    numberOfAssets++;
                }
            }
        }

        uint[] memory ass = new uint[](numberOfAssets);
        for(i = 0; i<numberOfAssets; i++){
            ass[i] = assets[i];
        }

        return ass;
    }


    /// @notice Function to pick random assets from potentialAssets array
    /// @param _finalSeed is final random seed
    /// @param _potentialAssets is bytes32[] array of potential assets
    /// @return uint[] array of randomly picked assets
    function pickRandomAssets(uint _finalSeed, bytes32[] _potentialAssets) public pure returns(uint[] finalPicked,uint[] x,uint[] y,uint[] zoom,uint[] rotation) {
        require(_finalSeed != 0);
        require(_potentialAssets.length > 0);

        uint[] memory assetIds = decodeAssets(_potentialAssets);
        uint[] memory pickedIds = new uint[](assetIds.length);
        x = new uint[](assetIds.length);
        y = new uint[](assetIds.length);
        zoom = new uint[](assetIds.length);
        rotation = new uint[](assetIds.length);

        uint finalSeedCopy = _finalSeed;
        uint index = 0;

        for(uint i = 0; i<assetIds.length; i++){
            finalSeedCopy = uint(keccak256(abi.encodePacked(finalSeedCopy, assetIds[i])));
            if(finalSeedCopy % 2 == 0){
                pickedIds[index] = assetIds[i];
                (x[index],y[index],zoom[index],rotation[index]) = pickRandomAssetPosition(finalSeedCopy);
                index++;
            }
        }

        finalPicked = new uint[](index);
        for(i = 0; i<index; i++){
            finalPicked[i] = pickedIds[i];
        }

        return (finalPicked,x,y,zoom,rotation);
    }


    /// @notice Function to pick random position for an asset
    /// @dev based on id and random_seed
    /// @param _random_seed is random seed for that image
    /// @return tuple of uints representing x,y,zoom,and rotation
    function pickRandomAssetPosition(uint _random_seed) public pure returns (uint,uint,uint,uint) {
        require(_random_seed!=0);
        uint rs = _random_seed;

        rs = rs % 10000;

        uint x;
        uint y;
        uint zoom;
        uint rotation;

        if (rs % 2 == 0) {
            x = rs%2450;
            y = rs%3500;
            zoom = rs%200 + 800;
            rotation = rs%360;
        }

        return (x,y,zoom,rotation);
    }


    /// @notice Function to calculate initial random seed based on our hashes
    /// @param _randomHashIds are ids in our array of hashes
    /// @param _timestamp is timestamp for that hash
    /// @return uint representation of random seed
    function calculateSeed(uint[] _randomHashIds, uint _timestamp) public view returns (uint){
        require(_timestamp!=0);
        require(_randomHashIds.length == 10);

        bytes32 randomSeed = keccak256(
            abi.encodePacked(
            randomHashes[_randomHashIds[0]], randomHashes[_randomHashIds[1]],
            randomHashes[_randomHashIds[2]], randomHashes[_randomHashIds[3]],
            randomHashes[_randomHashIds[4]], randomHashes[_randomHashIds[5]],
            randomHashes[_randomHashIds[6]], randomHashes[_randomHashIds[7]],
            randomHashes[_randomHashIds[8]], randomHashes[_randomHashIds[9]],
            _timestamp
            )
        );

        return uint(randomSeed);
    }


    /// @notice Function to calculate final random seed for user
    /// @param _random_seed is initially given random seed
    /// @param _iterations is number of iterations
    /// @return final seed for user as uint
    function getFinalSeed(uint _random_seed, uint _iterations) public pure returns (bytes32){
        require(_random_seed!=0);
        require(_iterations!=0);
        bytes32 finalSeed = bytes32(_random_seed);

        finalSeed = keccak256(abi.encodePacked(_random_seed, _iterations));
        for(uint i = 0; i<_iterations; i++){
            finalSeed = keccak256(abi.encodePacked(finalSeed, i));
        }

        return finalSeed;
    }


    function getRandomHash(uint _index) public view returns(bytes32){
        return randomHashes[_index];
    }

    function getLen() public view returns(uint) {
        return randomHashes.length;
    }

    function getSeed(uint assetId, uint random_seed) public pure returns(uint) {
        return uint(keccak256(abi.encodePacked(random_seed, assetId)));
    }

    function toHex(uint random_seed) public pure returns (bytes32) {
        return bytes32(random_seed);
    }
}
