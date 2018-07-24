const utils = require('./utils');
const Web3 = require('web3');
const leftPad = require('left-pad')
const conf = require('./config.json');
const starter_packs = require('./starter_packs.json');

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
async function getAttributesForAssets(assetIds) {
    let attributes = await assetManagerContract.methods.getAttributesForAssets(assetIds).call();
    console.log(attributes);
    return attributes;
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


async function getCreatedAssetPacks(address) {
    let assetPacksIds = await assetManagerContract.methods.getAssetPacksUserCreated(address).call();
    console.log("ASSET PACK IDS : " + assetPacksIds);
    return assetPacksIds;
}

async function getPaginatedAssetPacks(pagination, count, address) {
    let assetPacksIds = await assetManagerContract.methods.getAssetPacksUserCreated(address).call();
    let beginning = (pagination-1)*count;
    let end = pagination+count -1;
    console.log(beginning,end);
    return assetPacksIds.slice(beginning, end);
}

async function getCoversForAssetPacks(assetPackIds) {
    let hovers = await assetManagerContract.methods.getCoversForPacks(assetPackIds).call();
    for(let i=0; i<hovers.length; i++) {
        hovers[i] = utils.getIpfsHashFromBytes32(hovers[i]);
    }
    return hovers;
}

async function getPackInformation(assetPacksIds, account) {
    let srcs = await getCoversForAssetPacks(assetPacksIds);
    let names = await getAssetPacksNames(assetPacksIds);
    let data =[];
    for(let i=0; i<srcs.length; i++) {
        data.push({
            name: names[i],
            src: 'https://ipfs.decenter.com/ipfs/' + srcs[i],
        });
    }
    return data;
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
    let ids = response[1];
    let data = [];
    console.log(response);
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

async function usernameExists(username) {
    let res = await digitalPrintImageContract.methods.isUsernameExists(username).call();

    return res;
} 

async function getUsername(address) {
    let res = await digitalPrintImageContract.methods.getUsername(address).call();

    return res;
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
async function getImage(random_seed, iterations, potentialAssets) {
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
    let attributes = await getAttributesForAssets(pot_assets);

    for (let i = 0; i < pot_assets.length; i++) {
        // seed = seed.substr(2);
        let q = leftPad((pot_assets[i]).toString(16), 64, 0);
        seed = web3.utils.sha3(seed + q, {encoding: "hex"});

        let x = utils.hex2dec(seed); //BIGINT representation of seed

        let metadata = getAssetMetadata(x, pot_assets[i]);

        if (metadata != null) {
            pickedAssets.push({
              ...metadata,
              background: attributes[i],
            });
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
            pack_id: parseInt(info[1],10),
            attributes: info[2],
            ipfsHash: info[2],
        }
        return Info;
    }
}
async function getPositionsOfAssetsInImage(finalSeed, potentialAssets) {
    let data = await digitalPrintImageContract.methods.pickRandomAssets(finalSeed, potentialAssets).call();

    console.log(data);
    return data;
}
function generatePacks() {
    let packId = starter_packs["0"].id;
    let packData = starter_packs["0"].data;

    let pack = {
        id: packId,
        data: packData
    }
    let arr = [];
    arr.push(pack);
    console.log(pack);
    return arr;
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
    // console.log(await getAssetPackData(5));
    // console.log(await getPackInformation([1,2,3],"0xf67cDA56135d5777241DF325c94F1012c72617eA"));
    // await getImageMetadataFromContract(0);
    await getPositionsOfAssetsInImage('0x240610f366b57b4546eeaaa4de0e441613c1412f0b7f6689e1f19e858f056925',
        [ '0x0000000000000001000002000003000004000005000006000007000008000009', '0x000000000a00000b00000c00000d00000e00000f000010000011000012000013',
        '0x000000001400001500001600001700001800001900001a00001b00001c00001d',
        '0x000000001e00001f000020000021000022000023000024000025000026000027' ]);
    // await getAttributesForAssets([1,2,3,4]);
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
    getImageMetadataFromContract,
    calculateFirstSeed,
    pickTenRandoms,
    getUserImages,
    convertSeed,
    getAssetIpfs,
    getCreatedAssetPacks,
    getAssetPackData,
    getNumberOfAssetPacks,
    getAssetsIpfs,
    getCoversForAssetPacks,
    getAssetPacksNames,
    getPackInformation,
    getPaginatedAssetPacks,
    generatePacks,
    getPositionsOfAssetsInImage,
    getUsername,
    usernameExists
}
