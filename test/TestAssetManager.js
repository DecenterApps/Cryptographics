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
        let attr = 212;

        await assetManagerContract.createAsset(attr, ipfsHash, price,  {from: accounts[0]});

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();

        assert.equal(numberOfAssets, 1, "There'd be only 1 asset");
    });


    it("... should fail if there is same hash twice", async() => {
        let ipfsHash = "0x1234567";
        let price = 500000000000000;
        let attr = 212;

        await assetManagerContract.createAsset(attr, ipfsHash, price, {from:accounts[0]}).catch(error => {
            console.log("Error we have caught: "  + error);
        });

        await assetManagerContract.createAsset(attr, ipfsHash, price, {from:accounts[0]}).catch(error => {
            console.log("Error we have caught: "  + error);
        });

        let numberOfAssets = await assetManagerContract.getNumberOfAssets();
        numberOfAssets= parseInt(numberOfAssets,10);
        assert.equal(numberOfAssets,2,"There'd be only 2 assets ( 1 created in previous test and 1 in this test");
    });



    it("... user should have  permission for asset he created", async() => {
        let ipfsHash = "0x12345678";
        let price = 500000000000000;
        let attr = 212;

        await assetManagerContract.createAsset(attr, ipfsHash, price, {from: accounts[0]});

        let permission = await assetManagerContract.checkHasPermission(accounts[0], 0);
        assert.equal(permission, true, "User had to have permission for this asset")
    });


    it("... user should have  permission for asset he bought", async() => {
        let ipfsHash = "0x12345678abc";
        let price = 500000000000000;
        let attr = 212;

        await assetManagerContract.createAsset(attr, ipfsHash, price, {from: accounts[0]});

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

          let attributes = [212,222,222,211,121];
          for (let i=0; i<ipfsHashes.length; i++){
               ipfsHashes[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
          }

          await assetManagerContract.createAssetPack("Pakovanje 1",attributes,ipfsHashes,500000);

          let userPacks = await assetManagerContract.getAssetPacksUserCreated(accounts[0]);

          assert.equal(userPacks, 0, "Should be owner of 0th asset pack");
    });

    it("... should fail if there is no assets in pack", async() => {
       let ipfsHashes = [];
       let attributes = [212,222,222,211,121];

        await assetManagerContract.createAssetPack("Pakovanje2",attributes,ipfsHashes,500).catch(error => {
           console.log("Error we have caught: "  + error);
           assert.equal(error, 'Error: VM Exception while processing transaction: revert', "Transaction shoud be reverted");
       });

    });


    it("... should fail if asset ids are not equal", async() => {
        let ipfsHashes = [ 'QmUJeMDc3jETHdTUfCQyK27bMhSfoAFfRpQuX5RpVN2gHf',
            'QmQKJdkbGEsiav3vdzK8pTH4WoNXCoXN8VbZLrFoWjmPwR',
            'Qmd9VNGsVST4y4ZLz5rQtLmxDb2HhJwutAfQ5Et5MoAA7z',
            'QmaL8YXHZA2aayApzaAeeV2RDJXAf5ZvqCbPraQkgdkTSh',
            'QmPNSue3FwTVeYsYrDtMBPWwofFQCtP72C3m8vtYS3xEAu'];
        let attributes = [212,222,222,211,121];
        let ipfsHashes1 = [];
        for (let i=0; i<ipfsHashes.length; i++){
            ipfsHashes1[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
        }

        await assetManagerContract.createAssetPack("Pakovanje 3", attributes, ipfsHashes1,500000);

        let packData = await assetManagerContract.getAssetPackData(0);
        let id = 4;
        for(let i=0; i<packData[1].length; i++){
            assert.equal(id, packData[1][i].c[0], "Assets id should be same");
            id++;
        }
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

        let attributes = [212,222,222,211,121,212,222,222,211,121,222,111];
        let ipfsHashes1 = [];
        for (let i=0; i<ipfsHashes.length; i++){
            ipfsHashes1[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
        }

        await assetManagerContract.createAssetPack("Pakovanje 4",attributes, ipfsHashes1,500000);

        let numberOfPacks = await assetManagerContract.getNumberOfAssetPacks();

        assert.equal(numberOfPacks, 3, "There should be 3 packs");

        let packData = await assetManagerContract.getAssetPackData(2);
        for(let i=0; i<packData[2].length; i++) {
            let ipfs = utils.getIpfsHashFromBytes32(packData[3][i]);
            assert.equal(ipfs, ipfsHashes[i], "Decoded and encoded ipfs hashes should be the same");
        }
    });

    it("... should fail if returned hash is not equal to hash[0] and if returned data is not same", async() => {
       let ipfsHashes = ["QmQcYHQRy3eQTkzx85Uk6xVgoer3KCmpPQDNt1gUqWtBus",
           "QmPvPH5jyocBeDSgesr63rA581AVuCmN4hq2TDscJq51SU",
           "Qmaj86wPe5LMYyKNZNq6HKB5ma2qUstaVEfgCVsUEr3mi7",
           "Qmf9kLBs5KYCLirrzoFzcAgKPkuZqLj5iD7xSRYzZMm8WQ",
           "QmZFqCK1QRz8Esu7KyrVAqc2afBHVRcwiRCk2Hugr7zHa6",
           "QmW9W3AHpp9HYJZqMWxvtZsGU8yyGqXYWxHNPzbsvZeQuj"
       ];
       let packName = "Pack for assets"
       let ipfsHashes1 = [];
       let attributes = [222,212,211,212,112,111];
       for (let i=0; i<ipfsHashes.length; i++){
            ipfsHashes1[i] = utils.getBytes32FromIpfsHash(ipfsHashes[i]);
       }
       await assetManagerContract.createAssetPack(packName, attributes, ipfsHashes1,500000);

       let hover = await assetManagerContract.getHoverImagesForAssetPacks([3]);
       assert.equal(utils.getIpfsHashFromBytes32(hover[0]), ipfsHashes[0], "First asset should be equal");


       let packData = await assetManagerContract.getAssetPackData(3);
       assert.equal(packData[0], packName);

    });



});