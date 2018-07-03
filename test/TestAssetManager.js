const AssetManager = artifacts.require("../contracts/AssetManager.sol");


const utils = require("../front/scripts/utils.js");


contract('AssetManager', async(accounts) => {
    let assetManagerContract;

    before(async () => {
        assetManagerContract = await AssetManager.deployed();
    });


    it("... should fail if there is not created an asset", async () => {
        let ipfsHash = "0x123456789";
        let price = 500000000000000;

        await assetManagerContract.createAsset(ipfsHash, price,  {from: accounts[0]});

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();

        assert.equal(numberOfAssets, 1, "There'd be only 1 asset");
    });


    it("... should fail if there is same hash twice", async() => {
        let ipfsHash = "0x1234567";
        let price = 500000000000000;

        await assetManagerContract.createAsset(ipfsHash, price, {from:accounts[0]}).catch(error => {
            console.log("Error we have caught: "  + error);
        });

        await assetManagerContract.createAsset(ipfsHash, price, {from:accounts[0]}).catch(error => {
            console.log("Error we have caught: "  + error);
        });

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();
        numberOfAssets= parseInt(numberOfAssets,10);
        assert.equal(numberOfAssets,2,"There'd be only 2 assets ( 1 created in previous test and 1 in this test");
    });



    it("... user should have  permission for asset he created", async() => {
        let ipfsHash = "0x12345678";
        let price = 500000000000000;


        await assetManagerContract.createAsset(ipfsHash, price, {from: accounts[0]});

        let permission = await assetManagerContract.checkHasPermission(accounts[0], 0);
        assert.equal(permission, true, "User had to have permission for this asset")
    });


    it("... user should have  permission for asset he bought", async() => {
        let ipfsHash = "0x12345678abc";
        let price = 500000000000000;

        await assetManagerContract.createAsset(ipfsHash, price, {from: accounts[0]});

        await assetManagerContract.buyAssetPermision(0, {from: accounts[1], value: 500000000000000});


        let permission = await assetManagerContract.checkHasPermission(accounts[1], 0);
        assert.equal(permission, true, "User had to have permission for this asset ha has bought")
    });

    it("... user should be owner of asset pack", async() => {
          let ipfsHashes = [ 'QmUJeMDc2jETHdTUfCQyK27bMhSfoAFfRpQuX5RpVN2gHf',
                'QmQKJdkbGEsiav3vdzK8pTH5WoNXCoXN8VbZLrFoWjmPwR',
                'Qmd9VNGsVST4y4ZLz5rQtLMxDb2HhJwutAfQ5Et5MoAA7z',
                'QmaL8YXHZA2aayApzaAeeV7RDJXAf5ZvqCbPraQkgdkTSh',
                'QmPNSue3FwTVeYsYrDtMBPWWofFQCtP72C3m8vtYS3xEAu'];

          for (let i=0; i<ipfsHashes.length; i++){
               ipfsHashes[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
          }

          await assetManagerContract.createAssetPack(ipfsHashes,500000);

          let userPacks = await assetManagerContract.getAssetPacksUserCreated(accounts[0]);

          assert.equal(userPacks, 0, "Should be owner of 0th asset pack");
    });

    it("... should fail if asset ids are not equal", async() => {
        let ipfsHashes = [ 'QmUJeMDc3jETHdTUfCQyK27bMhSfoAFfRpQuX5RpVN2gHf',
            'QmQKJdkbGEsiav3vdzK8pTH4WoNXCoXN8VbZLrFoWjmPwR',
            'Qmd9VNGsVST4y4ZLz5rQtLmxDb2HhJwutAfQ5Et5MoAA7z',
            'QmaL8YXHZA2aayApzaAeeV2RDJXAf5ZvqCbPraQkgdkTSh',
            'QmPNSue3FwTVeYsYrDtMBPWwofFQCtP72C3m8vtYS3xEAu'];

        let ipfsHashes1 = [];
        for (let i=0; i<ipfsHashes.length; i++){
            ipfsHashes1[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
        }

        await assetManagerContract.createAssetPack(ipfsHashes1,500000);

        let packData = await assetManagerContract.getAssetPackData(0);
        let id = 4;
        for(let i=0; i<packData[0].length; i++){
            assert.equal(id, packData[0][i].c[0], "Assets id should be same");
            id++;
        }
        console.log(packData);
    });

    it("... should fail if asset hashes decoding and encoding doesn't work well", async() => {
        let ipfsHashes = ['QmcbMvJfgr6hZtAntXQnJrR4fLpkSDrbViqHzvakQHimWv',
            'QmaeDvJH2JX8dv5CMwcGzQvVzBvBQ1Xky5ctJktG455jUF',
            'QmQrP65e5JzcvKMSPjHpAXWU2i5FJrRUvjVV2vcC2xcPB7',
            'QmS8sTxL4EvUjAEtYnwDjqYGttM871v2hmE477jNn744bF',
            'QmbiiniuiY3hhdCdoTUrYN3yLLxwwEFLB6uCXzgUhCsegj',
            'QmXBmAt1KMoDqAKcU9mwxQbEmBtRJczRP5vKvb1yHwSsCM',
            'Qmdw2WRQDYFEbsdN3MCdtLe8mUyjr3uag7Za3UE7KckTBG',
            'QmRvPXhCnNpYP2jsm6izNYyqZMVD9dtW4GqWx5Q3JbVcV9',
            'QmbwU5SVSvwAQ6onRmzdGDq6f59zsvjxFEdWwX2FR7YQeX',
            'QmYQZatMfitmBPyEN2it7FNaRAYtLpph6piJKPSfTVUMGF',
            'QmQAkZzh8BX3epSnMeZKR9UyFzafsFeyrZ1MdfGWSvWMMt',
            'QmSJwe6FDjxLVr2C6ax63JWaLUJYzwJ3Px948MgrT7eTVM'
        ];

        let ipfsHashes1 = [];
        for (let i=0; i<ipfsHashes.length; i++){
            ipfsHashes1[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
        }

        console.log(ipfsHashes1);
        await assetManagerContract.createAssetPack(ipfsHashes1,500000);

        let numberOfPacks = await assetManagerContract.getNumberOfAssetPacks();
        console.log(numberOfPacks);

        let packData = await assetManagerContract.getAssetPackData(2);

        for(let i=0; i<packData[1].length; i++) {
            let ipfs = utils.getIpfsHashFromBytes32(packData[1][i]);
            assert.equal(ipfs, ipfsHashes[i], "Decoded and encoded ipfs hashes should be the same");
        }
    });




});