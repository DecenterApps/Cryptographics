const functions = require('../scripts/imgFunctions');


let randomSeed = 123123;
let iterations = 5;
let potentialAssets = ["0x0000000000000000000001000002000003000004000005000006000007000008",
    "0x0000000000000000000001000002000003000004000005000006000007000008"];

async function getData(randomSeed, iterations, potentialAssets) {
    var assets = functions.getImage(randomSeed, iterations, potentialAssets);
    var assetStats = [];
    for(let i=0; i<assets.length; i++){
        let stats = await functions.getAssetStats(assets[i].id);
        assetStats.push(stats);
        console.log(assets[i]);
        console.log(assetStats[i]);
    }

}

getData(randomSeed,iterations,potentialAssets);