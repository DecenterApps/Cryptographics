const Web3 = require('web3');
const conf = require('./config.json');
const EthereumTx = require('ethereumjs-tx');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
require('dotenv').load();


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

const ourAddress = process.env.ADDRESS;
const ourPrivateKey = process.env.PRIV_KEY;

web3.eth.defaultAccount = ourAddress;

let nonce = 0;
const gasPrice = 1902509001;

const assetManagerContractAddress = conf.assetManagerContract.networks["42"].address;
const assetManagerContract = new web3.eth.Contract(conf.assetManagerContract.abi, assetManagerContractAddress);

async function getNonce() {
    nonce = await web3.eth.getTransactionCount(ourAddress);
    console.log(nonce);
}

getNonce();

const getEncodedParams = (contractMethod, params = null) => {
    let encodedTransaction = null;
    if (!params) {
        encodedTransaction = contractMethod(params[0],params[1]).encodeABI(); // eslint-disable-line
    } else {
        encodedTransaction = contractMethod(params[0], params[1]).encodeABI() // eslint-disable-line
    }
    return encodedTransaction;
};

const sendTransaction = async (web3, contractMethod, from, params, _gasPrice, nonce, to) =>
    new Promise(async (resolve, reject) => {
        try {
            const privateKey = new Buffer(ourPrivateKey, 'hex');

            const data = contractMethod(...params).encodeABI();

            const gasPrice = await web3.utils.numberToHex(_gasPrice);

            // const gas = await web3.utils.numberToHex(2500000);
            const gas = await contractMethod(...params).estimateGas();

            let transactionParams = { from, to, data, gas, gasPrice, nonce };

            const txHash = await sendRawTransaction(web3, transactionParams, privateKey);
            console.log(`https://kovan.etherscan.io/tx/${txHash}`);
            resolve(txHash);
        } catch (err) {
            reject(err);
        }
    });

const sendRawTransaction = (web3, transactionParams, privateKey) =>
    new Promise((resolve, reject) => {
        const tx = new EthereumTx(transactionParams);

        tx.sign(privateKey);

        const serializedTx = `0x${tx.serialize().toString('hex')}`;

        web3.eth.sendSignedTransaction(serializedTx, (error, transactionHash) => {
            console.log("Err: ", error);
            if (error) reject(error);

            resolve(transactionHash);
        });
    });


const addAssetToContract = async (ipfs, price) => {
    try {
        let n = await web3.utils.numberToHex(nonce);
        await sendTransaction(web3, assetManagerContract.methods.createAsset, ourAddress, [ipfs,price],
            gasPrice, n, assetManagerContractAddress);
        nonce++;
    } catch (err) {
        console.log(err);
    }
};


async function ipfs() {

    let assetDir = '../dist/assets/';
    var files = fs.readdirSync(assetDir);

    let len = files.length;
    let assets = [];
    for(let i=1; i<len; i++){
        if(i<10){
            let str = "0"+i.toString()+".png";
            assets.push(str);
        } else {
            let str = i.toString()+".png";
            assets.push(str);
        }
    }
    let ipfsHashes = [];
    for(let asset of assets) {
        const { stdout, stderr } = await exec('ipfs add -q ../dist/assets/' + asset);
        ipfsHashes.push(stdout.split('\n')[0]);
    }
    return ipfsHashes;
}

async function test() {
    printAddresses();
    let ipfsHashes = await ipfs();
    console.log(ipfsHashes);
    for(let ipfsHash of ipfsHashes) {
        let price = Math.floor(Math.random()*1000);
        await addAssetToContract(ipfsHash, price);
    }

}

function printAddresses() {
    console.log("AssetManager contract : " + assetManagerContractAddress);
}



test();

module.exports ={
    addAssetToContract
}