const utils = require('./utils');
const Web3 = require('web3');
const util = require('ethereumjs-util');
const leftPad = require('left-pad')


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));


// Function to calculate keccak256 when input is (int and int)
// INTEGRATED WITH CONTRACT
function calculateSeed(random_seed,x){

    var hash = web3.sha3(leftPad((random_seed).toString(16), 64, 0) +
        leftPad((x).toString(16), 64, 0),
        {encoding : "hex"});
    return hash;
}

// Function to calculate final seed for input (random_seed -int & iterations-int)
// INTEGRATED WITH CONTRACT
function calculateFinalSeed(random_seed, iterations){
    var seed = calculateSeed(random_seed, iterations);
    for(let i=0; i<iterations; i++){
        seed = seed.toString().substr(2);
        let x = leftPad((i).toString(16),64,0);
        seed = web3.sha3(seed + x, {encoding: "hex"});
    }
    return seed;
}

//Function to get metadata for asset based on random seed and assetId
//seed - bytes32 ; assetId - integer
function getAssetMetadata(seed, assetId){

    let number = parseInt(seed.substr(seed.length-4),10);
    if(number%2==0) {
        // console.log(seed);
        let id = assetId;
        let x_coordinate = number % 2450;
        let y_coordinate = number % 3500;
        let zoom = number % 200 + 800;
        let rotation = number % 360;
        let Asset = {
            id: id,
            x_coordinate: x_coordinate,
            y_coordinate: y_coordinate,
            zoom: zoom,
            rotation: rotation
        };

        return Asset;
    }

    return null;
}

//INTEGRATED WITH CONTRACT
//(bytes32, uint, bytes32)
function getImage(random_seed, iterations, potentialAssets){

    var seed = calculateFinalSeed(random_seed,iterations);
    // console.log(seed);
    var pot_assets = utils.decode(potentialAssets).reverse();
    var pickedAssets = [];
    var pickedIds = [];
    for(let i=0; i<pot_assets.length; i++){

        seed = seed.substr(2);
        let q = leftPad((pot_assets[i]).toString(16),64,0);
        seed = web3.sha3(seed + q, {encoding:"hex"});


        let x = utils.hex2dec(seed); //BIGINT representation of seed
        // console.log("SEED " + x);
        let metadata  = getAssetMetadata(x, pot_assets[i]);
        if(metadata!=null) {
            // console.log("SEED IZABRAN" + x);
            pickedAssets.push(metadata); // just to save for later purposes
            pickedIds.push(metadata.id);
        }

    }
    // console.log("Picked assets from potential: ");
    // printImageData(pickedAssets);
    return pickedAssets;
}





test();


function test() {
     assets = getImage(13123,5, ["0x0000000000000000000001000002000003000004000005000006000007000008"]);
    // printImageData(assets);
    // console.log(getAssetMetadata("0x123f12ddd3ffaa",5));
}



function printImageData(assets) {
    for(let i=0; i<assets.length; i++){
        let obj = assets[i];
        console.log(obj)
    }
}
module.exports = {
    getImage, getAssetMetadata
}
