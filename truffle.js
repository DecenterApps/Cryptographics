const dotenv           = require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');


const mnemonic = process.env.ETHEREUM_ACCOUNT_MNEMONIC;

module.exports = {
    networks: {
        kovan: {
            provider: function() {
                return new HDWalletProvider(mnemonic, `https://kovan.decenter.com/`);
            },
            network_id: '42',
            gasPrice: 2000000000, // 2 GWei
        }
    }
}