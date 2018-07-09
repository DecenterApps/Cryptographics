# Cyptographics



### To run application
- Make sure you have solc compiler version >=0.4.23
- To deploy contracts:  
```
$ truffle migrate --network=kovan
$ cd frontend/scripts
$ python update_config.py
```

After that, to run client side :

- `$ yarn`
- `$ yarn start`
- `open localhost:3000`


### Documentation for contracts 
We use Docosaurus as tool for generating documentation for our Smart Contracts

- `$ cd Cryptographis/documentation/website`
- `$ npm install`
- `$ npm start`
- `open localhost:3000`

```
If you change contracts, to keep docs up to date run this within documentation folder:
$ solidity-docgen solidity-docgen ../ ../contracts ./
```
