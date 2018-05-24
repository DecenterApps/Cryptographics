const utils = require('./utils');
const Web3 = require('web3');
const util = require('ethereumjs-util');
const leftPad = require('left-pad')


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

function calculateSeed(random_seed,iterations){
    var hash = web3.sha3(leftPad((random_seed).toString(16), 64, 0) +
        leftPad((iterations).toString(16), 64, 0),
        {encoding : "hex"});

    return hash;
}


function calculateNthSeed(random_seed) {
    var seed = calculateSeed(random_seed,1);
    console.log(seed);
    seed = seed.toString().substr(2);
    var x = leftPad((2).toString(16), 64, 0);
    var secondSeed = web3.sha3( seed+x, {encoding: "hex"});
    console.log(secondSeed);
}
function calculateFinalSeed(random_seed, iterations){
    var hash = calculateSeed(random_seed,iterations);
    console.log(hash);
    var x = leftPad((2).toString(16), 64, 0);
    console.log(x);
    hash = hash.toString().substr(2);
    var h1 = web3.sha3(hash + x, {encoding : "hex"});
    console.log(h1);
}

calculateNthSeed(123123);
calculateFinalSeed(123123,1);