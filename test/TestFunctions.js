const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");
const Functions = artifacts.require("../contracts/Utils/Functions.sol");
const utils = require('../client/src/services/utils');
const advanceToBlock = require('./helpers/advanceToBlock').advanceToBlock;

contract('Functions', async (accounts) => {

    let dpm, functions;

    before(async () => {
        dpm = await DigitalPrintImage.deployed();
        functions = await Functions.deployed()

        await advanceToBlock(web3.eth.blockNumber+105);

        await functions.fillWithHashes();
    });

    
    it("...Should decode assets", async () => {
        let arr = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

        let encoded_arr = utils.encode(arr);
        res = await functions.decodeAssets(encoded_arr);

        for (let i=0; i<res.length; i++) {
            assert.equal(arr[i], parseInt(res[i]), "Arrays should be exactly same");
        }
        
    });

    // it("...Should create token and put it on sale", async () => {
        
    // });

});
