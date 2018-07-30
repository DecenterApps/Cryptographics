const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const utils = require('scripts/../frontend/src/services/utils');

contract('Functions', async (accounts) => {

    let dpm;

    before(async () => {
        dpm = await DigitalPrintImage.deployed();
    
        for (let i=0; i<150; i++) {
            await dpm.getLen();
        }

        await dpm.fillWithHashes();
    });

    
    it("...Should decode assets", async () => {
        let arr = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

        let encoded_arr = utils.encode(arr);
        res = await dpm.decodeAssets(encoded_arr);
        for (let i=0; i<res.length; i++) {
            res[i] = parseInt([i]);
        }

        // console.log(arr);
        // console.log(res);
        assert.equal(arr, res, "Arrays should be exactly same");
    });

    // it("...Should create token and put it on sale", async () => {
        
    // });

});