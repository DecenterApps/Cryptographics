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

function getAssetMetadata(seed, imageId){
    let number = parseInt(seed.substr(seed.length-4),10);
    if(number%2==0) {
        let id = imageId;
        let x_coordinate = number % 2450;
        let y_coordinate = number % 3500;
        let zoom = number % 200 + 800;
        let rotation = number % 360;
        let Image = {
            id: id,
            x_coordinate: x_coordinate,
            y_coordinate: y_coordinate,
            zoom: zoom,
            rotation: rotation
        };
        return Image;
    }
    return null;
}

//INTEGRATED WITH CONTRACT
function getImage(random_seed, iterations, potentialAssets){
    var seed = calculateFinalSeed(random_seed,iterations);
    var pot_assets = utils.decode(potentialAssets).reverse();
    var pickedAssets = [];
    var pickedIds = [];
    for(let i=0; i<pot_assets.length; i++){
        let x = utils.hex2dec(seed); //BIGINT representation of seed
        let metadata  = getAssetMetadata(x, pot_assets[i]);
        if(metadata!=null) {
            pickedAssets.push(metadata); // just to save for later purposes
            pickedIds.push(metadata.id);
        }
        seed = seed.substr(2);
        let q = leftPad((i).toString(16),64,0);
        seed = web3.sha3(seed + q, {encoding:"hex"});
    }
    // console.log("Potential assets: " + pot_assets);
    // console.log("Picked assets from potential: " + pickedAssets);
    return pickedIds;
}





assets = getImage(13123,5, ["0x0000000000000000000001000002000003000004000005000006000007000008"]);



function printImageData(assets) {
    for(let i=0; i<assets.length; i++){
        let obj = assets[i];
        console.log(obj)
    }
}

module.exports = {
    getImage
}
