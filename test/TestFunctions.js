const utils = require('../FE/utils');
const BigInt = require('big-integer');
const imgFunctions = require('../FE/imgFunctions');
const Functions = artifacts.require("../contracts/Functions.sol");

contract('Functions', async(accounts) => {
	let functionsContract = await Functions.deployed();

	it("... there is needed to be 100 random hashes", async () => {
		let len = await functionsContract.getLen();
		if(len == 0) {
					await functionsContract.fillRadnomHashes();
		}
		len = await functionsContract.getLen();

		assert.equal(len,100,"Length of array should be 100");
	});

	it("... encoded bytes are not same ",async () => {
		let arr = [1,2,3,4,5,6,7,8];
		let encoded = utils.encode(arr);

		let decoded = await functionsContract.decodeAssets(encoded);

		assert.equal(arr[0],decoded[7],"decoded must be equal to input")

	});

	it("... calculated seed is not valid" ,async () => {
		let arr = [1,2,3,4,5,6,7,8,9,10];
		let timestamp = 5;
		let expectedSeed = "3038043115447625647821825492869921010382952898879644361139031013371457459551";
		let seed = await functionsContract.calculateSeed(arr,timestamp);
		seed = seed.c.join("");
		
		assert.equal(expectedSeed, seed, "Expected and generated seed must be equal");
	});

	it("... picked different assets" , async() => {
		let potential = ["0x0000000000000000000001000002000003000004000005000006000007000008"];
		let randomSeed = 13123;
		let iterations = 5;
		let potentialFromContract = await functionsContract.pickRandomAssets(randomSeed, iterations, potential);
		let arrFromContract = [];
		for(let i=0; i<potentialFromContract.length;i++){
			arrFromContract.push(potentialFromContract[i].c[0]);
		}
		let potentialFromJS = imgFunctions.getImage(randomSeed,iterations,potential);
		assert.equal(arrFromContract.toString(),potentialFromJS.toString(),"Return values must be equal");
	});


	

});