const utils = require('../scripts/utils');
const imgFunctions = require('../scripts/imgFunctions');
const Functions = artifacts.require("../contracts/Utils/Functions.sol");

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
		let positionsX = [];
		let potentialFromContract = [];
		let positionsY = [];


		let x = await functionsContract.pickRandomAssets(randomSeed, iterations, potential);

		for(let index=0; index<x[0].length; index++){

			potentialFromContract.push(x[0][index].c[0]);
			positionsX.push(x[1][index].c[0]);
			positionsY.push(x[2][index].c[0]);
		}
		// console.log(potentialFromContract);
		// console.log(positionsX);
		// console.log(positionsY);

		let potentialFromJS = imgFunctions.getImage(randomSeed,iterations,potential);

		for(let index=0; index < potentialFromContract.length; index++){
			assert.equal(potentialFromContract[index], potentialFromJS[index].id, "Ids must be equal");
			assert.equal(positionsX[index], potentialFromJS[index].x_coordinate, "X coordinates must be equal");
			assert.equal(positionsY[index], potentialFromJS[index].y_coordinate, "Y coordinates must be equal");
		}
	 });




	

});