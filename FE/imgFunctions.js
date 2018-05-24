const utils = require('./utils');
const Web3 = require('web3');
const util = require('ethereumjs-util');
const leftPad = require('left-pad')


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

function calculateSeed(random_seed,iterations){
    var hash = web3.sha3(leftPad((random_seed).toString(16), 64, 0) +
        leftPad((iterations).toString(16), 64, 0),
        {encoding : "hex"});

    return util.bufferToHex(hash);
}

console.log(calculateSeed(123123,5));