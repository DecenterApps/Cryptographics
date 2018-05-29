const Web3 = require('web3');
const conf = require('./config.json');
const EthereumTx = require('ethereumjs-tx');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

require('dotenv').load();


const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

const ourAddress = process.env.ADDRESS;
const ourPrivateKey = process.env.PRIV_KEY;


web3.eth.defaultAccount = ourAddress;

let nonce = web3.eth.getTransactionCount(ourAddress);
const gasPrice = 1502509001;

// const functionsContractAddress = conf.functionsContract.networks["42"].address;
// const functionsContract = web3.eth.contract(conf.functionsContract.abi).at(functionsContractAddress);

const assetManagerContractAddress = conf.assetManagerContract.networks["42"].address;
const assetManagerContract = web3.eth.contract(conf.assetManagerContract.abi).at(assetManagerContractAddress);

const getEncodedParams = (contractMethod, params = null) => {
    let encodedTransaction = null;
    if (!params) {
        encodedTransaction = contractMethod.request.apply(contractMethod); // eslint-disable-line
    } else {
        encodedTransaction = contractMethod.request.apply(contractMethod, params); // eslint-disable-line
    }
    return encodedTransaction.params[0];
};

const sendTransaction = async (web3, contractMethod, from, params, _gasPrice, nonce) =>
    new Promise(async (resolve, reject) => {
        try {
            const privateKey = new Buffer(ourPrivateKey, 'hex');

            const { to, data } = getEncodedParams(contractMethod, params);

            const gasPrice = web3.toHex(_gasPrice);

            const gas = web3.toHex(1190000);

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

        web3.eth.sendRawTransaction(serializedTx, (error, transactionHash) => {
            console.log("Err: ", error);
            if (error) reject(error);

            resolve(transactionHash);
        });
    });


const addAssetToContract = async (ipfs, price, layer) => {
    try {
        await sendTransaction(web3, assetManagerContract.createAsset, ourAddress, [ipfs,price,layer],
            gasPrice, web3.toHex(nonce));
        nonce++;
    } catch (err) {
        console.log(err);
    }
};


async function ipfs() {
    const assets = ['img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg','img6.jpg','img7.jpg','img8.jpg'];
    let ipfsHashes = [];
    for(let asset of assets) {
        const { stdout, stderr } = await exec('ipfs add -q ./assets/' + asset);
        ipfsHashes.push(stdout.split('\n')[0]);
    }
    return ipfsHashes;
}

async function test() {
    let ipfsHashes = await ipfs();
    console.log(ipfsHashes);
    for(let ipfsHash of ipfsHashes) {
        await addAssetToContract(ipfsHash, 150, 3);
    }
}
