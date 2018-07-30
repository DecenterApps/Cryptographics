const Web3 = require('web3');
const conf = require('../config/config.json');
const account_config = require('../../config.json');
const EthereumTx = require('ethereumjs-tx');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

const utils = require('../src/services/utils');


require('dotenv').load();


const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`));



web3.eth.defaultAccount = account_config.address;

console.log(account_config.address);


let nonce = 0;
const gasPrice = 1902509001;

const assetManagerContractAddress = conf.assetManagerContract.networks["42"].address;
const assetManagerContract = new web3.eth.Contract(conf.assetManagerContract.abi, assetManagerContractAddress);

async function getNonce() {
    nonce = await web3.eth.getTransactionCount(account_config.address);
    console.log(nonce);
}

getNonce();

const sendTransaction = async (web3, contractMethod, from, params, _gasPrice, nonce, to) =>
    new Promise(async (resolve, reject) => {
        try {
            const privateKey = new Buffer(account_config.privKey, 'hex');

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


const addAssetToContract = async (attributes, ipfs, price, address) => {
    try {
        let n = await web3.utils.numberToHex(nonce);
        await sendTransaction(web3, assetManagerContract.methods.createAsset, account_config.address, [attributes, ipfs, price],
            gasPrice, n, assetManagerContractAddress);
        nonce++;
    } catch (err) {
        console.log(err);
    }
};


const addAssetPackToContract = async (name, attributes, ipfs, price, address) => {
    try {
        let n = web3.utils.numberToHex(nonce);
        let p = await sendTransaction(web3, assetManagerContract.methods.createAssetPack, account_config.address, [name, attributes, ipfs, price],
            gasPrice, n, assetManagerContractAddress);
        nonce++;
    } catch (err) {
        console.log(err);
    }
};

const addAssetPackToContract1 = async(ipfsHashes, price, address) => {
    try {
        return await assetManagerContract.methods.createAssetPack(ipfsHashes,price).send({
            from: account_config.address, to: assetManagerContract
        }, (a,b) => {
            console.log(a,b);
        });
    } catch (e) {
        console.log(e);
        throw new Error('Cannot create asset pack');
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

async function testAddAsset() {
    printAddresses();
    let ipfsHashes = await ipfs();
    console.log(ipfsHashes);
    for(let ipfsHash of ipfsHashes) {
        ipfsHash = utils.getBytes32FromIpfsHash(ipfsHash);
        let price = Math.floor(Math.random()*1000);
        await addAssetToContract(ipfsHash, price);
    }
}

async function testAddAssetPacks() {
    printAddresses();
    let ipfsHashes = await ipfs();
    let chunk = 10;
    let converted = [];
    let attributes = [];
    for(let i=0; i< ipfsHashes.length; i+=chunk){
        let temparray = ipfsHashes.slice(i,i+chunk);
        for (let j=0; j<temparray.length; j++){
            temparray[j] = utils.getBytes32FromIpfsHash(temparray[j]);
            attributes.push(212);

        }
        converted.push(temparray);
        temparray = [];
    }
    for(data of converted) {
        await addAssetPackToContract("AssetPack",attributes, data,2000);
    }
}

function printAddresses() {
    console.log("AssetManager contract : " + assetManagerContractAddress);
}


testAddAssetPacks();

module.exports ={
    addAssetToContract
}