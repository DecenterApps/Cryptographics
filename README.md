# Cyptographics



### To run application
- Make sure you have solc compiler version >=0.4.23
- To deploy and run application with new contracts:  
```
$ git pull | git clone & cd Cryptographics
$ npm install
$ truffle migrate --network=kovan
$ cd frontend/scripts
$ cp config.json.dist config.json
$ python update_config.py

```
- To run application with already deployed and used contracts:
```
$ git pull | git clone & cd Cryptographics
$ npm install
$ cd frontend/scripts
$ cp config.json.dist config.json
```

After that, to run client side from root of the project:

- `$ yarn dev`
- `open http://127.0.0.1:3300/create`


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
