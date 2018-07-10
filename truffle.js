const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const config = require('./config.json');

module.exports = {
    networks: {
        kovan: {
            provider: function() {
                return new HDWalletProvider(config.privKey, `https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`);
            },
            network_id: '42',
            gasPrice: 2000000000, // 2 GWei
        }
    }
}