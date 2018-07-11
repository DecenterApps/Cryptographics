const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const Marketplace = artifacts.require("../contracts/Marketplace.sol");

contract('Marketplace', async (accounts) => {

    let marketplace, dpm;

    before(async () => {
        marketplace = await Marketplace.deployed();
        dpm = await DigitalPrintImage.deployed();
    });

    it("...Should deploy and set both addresses right", async () => { 
        
        let c1 = await dpm.marketplaceContract();
        let c2 = await Marketplace.address;

        let c3 = await marketplace.digitalPrintImageContract();
        let c4 = await DigitalPrintImage.address;

        assert.equal(c1, c2, "Marketplace contracts doesn't match, probably not added to DPM contract");
        assert.equal(c3, c4, "DPM contracts doesn't match, probably not added to Marketplace contract");
    });

    it("...Should create token and put it on sale", async () => {
        let price = 100000000;
        
        let res = await dpm.createImageTest();
        let tokenId = res.logs[0].args._tokenId.toString();
        let b = await marketplace.sell(tokenId, price);

        //get ad
        let ad = await marketplace.sellAds(tokenId);

        assert.equal(ad[0].toString(), price.toString(), "Price is not equal, check price of image");
        assert.equal(ad[1], accounts[0], "Exchanger is not valid, check from which address it is added");
        assert.equal(ad[2], true, "Exists not set to true");
    });

    it("...Should be able to buy token from sale", async () => {
        let price = 100000000;
        
        let res = await dpm.createImageTest();
        let tokenId = res.logs[0].args._tokenId.toString();
        let b = await marketplace.sell(tokenId, price);
        let c = await marketplace.buy(tokenId, {from: accounts[1], value: price});
        
        let newOwner = await dpm.ownerOf(tokenId);

        //get ad
        let ad = await marketplace.sellAds(tokenId);

        assert.equal(ad[2], false, "After buy it shouldn't be on sale anymore");
        assert.equal(newOwner, accounts[1], "New owner is not set");
    });

    // it("...Should create token and put it on sale", async () => {
        
    // });

});