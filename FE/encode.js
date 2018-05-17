require('dotenv').load();

const Web3 = require('web3');



const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.decenter.com"));

const ourAddress = process.env.ADDRESS;
const ourPrivateKey = process.env.PRIV_KEY;


web3.eth.defaultAccount = ourAddress;
let nonce = web3.eth.getTransactionCount(ourAddress);



function encode(id, x, y, zoom, rotation) {
    var id_bit = id.toString(2);
    var x_bit = x.toString(2);
    var y_bit = y.toString(2);
    var zoom_bit = zoom.toString(2);
    var rotation_bit = zoom.toString(2);

    console.log(id_bit)
}
