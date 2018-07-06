const utils = require('./utils');
const Web3 = require('web3');
const util = require('ethereumjs-util');
const leftPad = require('left-pad')
const conf = require('./config.json');
const bs58 = require('bs58');

const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`));

const assetManagerContractAddress = conf.assetManagerContract.networks["42"].address;
const assetManagerContract = new web3.eth.Contract(conf.assetManagerContract.abi, assetManagerContractAddress);

const digitalPrintImageContractAddress = conf.digitalPrintImageContract.networks["42"].address;
const digitalPrintImageContract = new web3.eth.Contract(conf.digitalPrintImageContract.abi, digitalPrintImageContractAddress);

// Function to pick ten random integers [0,99]
// Will be executed during generating initial random seed
function pickTenRandoms() {
    let randoms = [];
    for (let i = 0; i < 10; i++) {
        randoms.push(Math.floor(Math.random() * 100));
    }
    return randoms;
}

async function getAssetIpfs(assetId) {
    let ipfsHash = await assetManagerContract.methods.getAssetIpfs(assetId).call();
    let ipfsDecoded = utils.getIpfsHashFromBytes32(ipfsHash);
    console.log("Asset ipfs hash = " + ipfsHash);
    return ipfsDecoded;
}

async function getAssetsIpfs(assetIds) {
    let ipfsHashes = await assetManagerContract.methods.getIpfsForAssets(assetIds).call();
    for(let i=0; i<ipfsHashes.length; i++) {
        ipfsHashes[i] = utils.getIpfsHashFromBytes32(ipfsHashes[i]);
    }
    return ipfsHashes;

}

async function getImageIpfs(imageId) {
    let ipfsHash = await digitalPrintImageContract.methods.idToIpfsHash(imageId).call();
    console.log("Image ipfs hash = " + ipfsHash);
    return ipfsHash;
}

async function getBoughtAssets(address) {
    let assetIds = await assetManagerContract.methods.getAssetsForUser(address).call();
    console.log("ASSET IDS :" + assetIds);
    return assetIds;
}


async function getCreatedAssetPacks(address) {
    let assetPacksIds = await assetManagerContract.methods.getAssetPacksUserCreated(address).call();
    console.log("ASSET PACK IDS : " + assetPacksIds);
    return assetPacksIds;
}

async function getHoversForAssetPacks(assetPackIds) {
    let hovers = await assetManagerContract.methods.getHoverImagesForAssetPacks(assetPackIds).call();
    for(let i=0; i<hovers.length; i++) {
        hovers[i] = utils.getIpfsHashFromBytes32(hovers[i]);
    }
    return hovers;
}

async function getPackInformation(assetPacksIds, account) {
    let srcs = await getHoversForAssetPacks(assetPacksIds);
    let names = await getAssetPacksNames(assetPacksIds);
    let stats = await getOwnedAssetsFromPacks(assetPacksIds, account);

    let data =[];
    for(let i=0; i<srcs.length; i++) {
        data.push({
            name: names[i],
            source: 'https://ipfs.decenter.com/ipfs/' + srcs[i],
            stats: stats[i],
        });
    }
    return data;
}
async function getOwnedAssetsFromPacks(assetPackIds, account) {
    let data = await assetManagerContract.methods.getOwnedAssetsFromPacks(assetPackIds,account).call();
    let stats = [];
    for(let i=0; i<data[0].length; i++) {
        var asset = {
            pack_id: assetPackIds[i],
            owned: parseInt(data[0][i],10),
            total : parseInt(data[1][i],10)
        }
        stats.push(asset);
    }
    return stats;
}
async function getAssetPacksNames(assetPacksIds) {
    let names = [];
    for(let i=0; i<assetPacksIds.length; i++) {
        let name = await assetManagerContract.methods.getAssetPackName(assetPacksIds[i]).call();
        names.push(name);
    }

    return names;
}

async function getNumberOfAssetPacks() {
    let numberOfPacks = await assetManagerContract.methods.getNumberOfAssetPacks().call();
    console.log(numberOfPacks);
    return numberOfPacks;
}


async function getAssetPackData(assetPackId) {
    let response = await assetManagerContract.methods.getAssetPackData(assetPackId).call();
    let ids = response[0];
    let data = [];
    for (let i = 0; i < ids.length; i++) {
        var Asset = {
            pack_name: response[0],
            id: response[1][i],
            attribute: response[2][i],
            ipfsHash: utils.getIpfsHashFromBytes32(response[3][i]),
        };
        data.push(Asset);
    }
    return data;
}

async function calculatePrice(pickedAssets, owner) {
    console.log(pickedAssets);
    if (pickedAssets.length == 0) {
        return 0;
    }

    if (owner.toString().length != 42) {
        return null;
    }

    let price = await digitalPrintImageContract.methods.calculatePrice(pickedAssets, owner).call();
    return price;
}

// Function to get total number of assets existing on contract
async function getNumberOfAssets() {
    let number = await assetManagerContract.methods.getNumberOfAssets().call();
    console.log(assetManagerContract.methods.getNumberOfAssets());
    console.log(await assetManagerContract.methods.getNumberOfAssets().call())
    return number;
}

async function getAssetsUserCreated(address) {
    let assets = await assetManagerContract.methods.getAssetsUserCreated(address).call();
    return assets;
}

async function getUserImages(address) {
    if (address.length != 42) {
        return -1;
    }
    let imageIds = await digitalPrintImageContract.methods.getUserImages(address).call();
    return imageIds;
}

async function getImageMetadataFromContract(image_id) {
    if (image_id < 0) {
        return null;
    }
    let imageMetadata = await digitalPrintImageContract.methods.getImageMetadata(image_id).call();
    imageMetadata[0] = await convertSeed(imageMetadata[0]);
    console.log(imageMetadata);
    return imageMetadata;
}

async function convertSeed(randomSeed) {
    let seed = await digitalPrintImageContract.methods.toHex(randomSeed).call();
    return seed;
}


// Function to calculate first random seed, it will be executed from contract

async function calculateFirstSeed(timestamp, rands) {
    console.log("Timestamp: " + timestamp);
    console.log("Rands: " + rands);
    let randomSeed = await digitalPrintImageContract.methods.calculateSeed(rands, timestamp).call();
    console.log("RANDOM SEED: " + randomSeed)
    return randomSeed;
}

// Function to calculate keccak256 when input is (int and int)
// INTEGRATED WITH CONTRACT
function calculateSeed(random_seed, x) {
    var hash = web3.utils.sha3(leftPad((random_seed).toString(16), 64, 0) +
        leftPad((x).toString(16), 64, 0),
        {encoding: "hex"});
    return hash;
}

// Function to calculate final seed for input (random_seed -int & iterations-int)
// INTEGRATED WITH CONTRACT
function calculateFinalSeed(random_seed, iterations) {
    var seed = calculateSeed(random_seed, iterations);
    for (let i = 0; i < iterations; i++) {
        // seed = seed.toString().substr(2);
        let x = leftPad((i).toString(16), 64, 0);
        seed = web3.utils.sha3(seed + x, {encoding: "hex"});
    }
    return seed;
}


//Function to get metadata for asset based on random seed and assetId
//seed - bytes32 ; assetId - integer
function getAssetMetadata(seed, assetId) {
    seed = seed.toString();
    let number = parseInt(seed.substr(seed.length - 4), 10);
    // If number can be divided by 2 means that asset will be included into image
    if (number % 2 == 0) {
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


//INTEGRATED WITH CONTRACT - function to getImage info
//(bytes32, uint, bytes32)
function getImage(random_seed, iterations, potentialAssets) {
    random_seed = random_seed.toString(16);
    var seed = calculateFinalSeed(random_seed, iterations);
    let pot_assets = [];
    console.log(potentialAssets.length);
    for(let j=0; j<potentialAssets.length; j++) {
        let arr =[];
        arr.push(potentialAssets[j]);
        // pot_assets.push(utils.decode(arr).reverse());
        pot_assets = [...pot_assets, ...utils.decode(arr).reverse()]
    }
    // var pot_assets = utils.decode(potentialAssets).reverse();
    console.log(pot_assets);
    var pickedAssets = [];

    for (let i = 0; i < pot_assets.length; i++) {
        // seed = seed.substr(2);
        let q = leftPad((pot_assets[i]).toString(16), 64, 0);
        seed = web3.utils.sha3(seed + q, {encoding: "hex"});

        let x = utils.hex2dec(seed); //BIGINT representation of seed

        let metadata = getAssetMetadata(x, pot_assets[i]);

        if (metadata != null) {
            pickedAssets.push(metadata);
        }
    }
    return pickedAssets;
}

//Function to get data from contract for every asset (id,creator, ipfsHash, and price) - based on asset id
async function getAssetStats(id) {
    let numberOfAssets = await assetManagerContract.methods.getNumberOfAssets().call();
    numberOfAssets = parseInt(numberOfAssets, 10);
    let layer = Math.floor(Math.random() * 10);
    if (id >= numberOfAssets) {
        return null;
    } else {
        let info = await assetManagerContract.methods.getAssetInfo(id).call();
        let Info = {
            id: parseInt(info[0], 10),
            creator: info[1],
            ipfsHash: info[2],
            price: parseInt(info[3], 10),
            layer: layer
        }
        return Info;
    }
}

async function test() {
    // assets = getImage("0x0de5ac0773fa76034fd9fdcfbd8f8b96377fd2d0057ed6d0080afd3434b91636",5, ["0x000000000100000200000300000400000500000600000700000800000900000a", "0x000000000000000000000000000000000000000000000000000000000000000b"]);
    // printImageData(assets);
    // console.log(getAssetMetadata("0x123f12ddd3ffaa",5));
    // getImageMetadataFromContract(0);
    // let ipfs = await getAssetIpfs(5);
    // console.log("DECODED : " + utils.getIpfsHashFromBytes32(ipfs));

    // console.log(await getCreatedAssetPacks("0xf67cDA56135d5777241DF325c94F1012c72617eA"));
    // console.log(await getAssetPackData(0));
    // console.log(await getAssetPackData(0));
    console.log(await getPackInformation([1,2,3],"0xf67cDA56135d5777241DF325c94F1012c72617eA"));
}


function printImageData(assets) {
    for (let i = 0; i < assets.length; i++) {
        let obj = assets[i];
        console.log(obj)
    }
}

test();

module.exports = {
    getImage,
    getAssetStats,
    getNumberOfAssets,
    calculatePrice,
    getImageIpfs,
    getAssetsUserCreated,
    getImageMetadataFromContract,
    calculateFirstSeed,
    pickTenRandoms,
    getUserImages,
    convertSeed,
    getBoughtAssets,
    getAssetIpfs,
    getCreatedAssetPacks,
    getAssetPackData,
    getNumberOfAssetPacks,
    getAssetsIpfs,
    getHoversForAssetPacks,
    getAssetPacksNames,
    getOwnedAssetsFromPacks,
    getPackInformation
}
