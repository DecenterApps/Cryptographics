# Cyptographics

### Documentation - website directory
- `$ cd DigitalPrint/website`
- `$ npm install`
- `$ npm start`
- `open localhost:3000`


Create ".env" file in folders : 
- `./scripts `
- `./` (project root)

With following: 
```
ETHEREUM_ACCOUNT_MNEMONIC="YOUR_PRIV_KEY"
PRIV_KEY="YOUR_PRIV_KEY"
ADDRESS="YOUR_ETH_ADDRESS"
```

### To run application
- Make sure you have solc compiler version >=0.4.23
- To deploy contracts and add automatically 20 assets: 
- Setup .env files
```
$ truffle migrate --network=kovan
$ cd front/scripts
$ python update_config.py
$ node addAssets.js
```

After that, to run client side :

- `$ yarn`
- `$ yarn start`
- `open localhost:3000`
