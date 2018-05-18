require('dotenv').load();

const Web3 = require('web3');



const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

const ourAddress = process.env.ADDRESS;
const ourPrivateKey = process.env.PRIV_KEY;


web3.eth.defaultAccount = ourAddress;

