const utils = require('./utils');
const Web3 = require('web3');
const conf = require('./config.json');


require('dotenv').load();


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

const ourAddress = process.env.ADDRESS;
const ourPrivateKey = process.env.PRIV_KEY;

web3.eth.defaultAccount = ourAddress;

let nonce = web3.eth.getTransactionCount(ourAddress);
const gasPrice = 1502509001;

const transactionObject = {
    from: web3.eth.defaultAccount,
    gas: 4000000,
    gasPrice: gasPrice
};


const testContractAddress = conf.testcontract.networks["42"].address;
const testContract = web3.eth.contract(conf.testcontract.abi).at(testContractAddress);

// testContract.parseBytes([1,2,3,4,5]);
console.log(testContract.procitaj(0));