# Cryptographics

### About
Cryptographics is a fully decentralized visual platform that allows users to create, store and trade unique randomly generated digital artwork on the blockchain. Artists, illustrators, photographers or other graphic designers, can create and upload their asset packs, making them available for Creators to buy and use.

Creators buy asset packs and use them to generate unique random digital artworks called Cryptographics and claim ownership by storing them on the blockchain as unique ERC721 tokens in order to keep or sell them.

Collectors can purchase and collect Cryptographics, either to create a collection of their own, or to trade them as unique digital collectibles on the marketplace.

Cryptographics is powered by the Ethereum blockchain and each Cryptographic is stored as a unique ERC721 token.


### Run with pre-deployed contracts:
```
$ yarn
$ yarn copyConfig
$ yarn generatePacks
$ yarn dev
```


### Run with deploying your own contracts
- Make sure you have solc compiler version >=0.4.23
```
$ yarn
$ truffle migrate --network=kovan
$ cd scripts
$ python(3) update_config.py
$ cd ../
$ yarn copyConfig
$ yarn generatePacks
$ yarn dev
```
Note: Leave input empty when running `generatePacks` for the first time after contract deployment.


- To specify which asset packs are selected by default on the homepage use `generatePacks` again and specify the asset pack IDs.
