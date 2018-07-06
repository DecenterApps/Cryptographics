const dotenv           = require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');


const mnemonic = process.env.ETHEREUM_ACCOUNT_MNEMONIC;

module.exports = {
    networks: {
        kovan: {
            provider: function() {
                return new HDWalletProvider(mnemonic, `https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`);
            },
            network_id: '42',
            gasPrice: 4700000, // 2 GWei
        }
    }
}