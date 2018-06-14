const utils = require('../front/scripts/utils');
const imgFunctions = require('../front/scripts/functions');
const DigitalPrintImage = artifacts.require("../contracts/Image/DigitalPrintImage.sol");

contract('DigitalPrintImage', async(accounts) => {
	let functionsContract = await DigitalPrintImage.deployed();

	it("... should fail if there is no 100 random hashes", async () => {
		let len = await functionsContract.getLen();
		if(len == 0) {
					await functionsContract.fillRadnomHashes();
		}
		len = await functionsContract.getLen();

		assert.equal(len,100, "Length of array should be 100");
	});

	it("... should encode bytes to be same",async () => {
		let arr = [1,2,3,4,5,6,7,8];
		let encoded = utils.encode(arr);

		let decoded = await functionsContract.decodeAssets(encoded);

		assert.equal(arr[0],decoded[7],"Decoded must be equal to input")

	});

	it("... should fail if empty array sent",async () => {
		let arr = [];
		let encoded = utils.encode(arr);
        let decoded = await functionsContract.decodeAssets(encoded).catch(error => {
            console.log("Error we have caught: "  + error);
        });

        assert.equal(decoded, null," Decoded must be equal to input")

	});

	it("... should fail if more than 50 assets",async () => {
		let arr = [];
		for(let i=0; i<55; i++){
			arr.push(i);
		}
		let encoded = utils.encode(arr);
		let decoded = await functionsContract.decodeAssets(encoded);
		if(decoded.length < 50){
            assert.equal(arr[0],decoded[7],"decoded must be equal to input")
        }

	});

	it("... should fail if empty bytes with all 0 sent",async () => {
		let decoded = await functionsContract.decodeAssets(["0x0000000000000000000000000000000000000000000000000000000000000000"]);
		
		assert.equal(decoded.length, 0, "Length should be zero");

	});

	it("... should fail if there is two times same asset",async () => {
		let arr = [1, 1, 1];
		let encoded = utils.encode(arr);

		let decoded = await functionsContract.decodeAssets(encoded);
		
	});

	it("... should fail if calculated seed is not equal to expected" ,async () => {
		let arr = [1,2,3,4,5,6,7,8,9,10];
		let timestamp = 5;
		let expectedSeed = "3038043115447625647821825492869921010382952898879644361139031013371457459551";
		let seed = await functionsContract.calculateSeed(arr,timestamp);
		seed = seed.c.join("");
		
		assert.equal(expectedSeed, seed, "Expected and generated seed must be equal");
	});



	it("... should fail if potential assets and positions picked are not equal" , async() => {
		let potential = ["0x0000000000000000000001000002000003000004000005000006000007000008"];
		let randomSeed = "0x7cd645a192b2f11717d87f06e2e2e9839c435754beb8a345f4fefda7128d4444";
		let iterations = 4;
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
		console.log(potentialFromJS)
		for(let index=0; index < potentialFromContract.length; index++){
			assert.equal(potentialFromContract[index], potentialFromJS[index].id, "Expected Ids must be equal");
			assert.equal(positionsX[index], potentialFromJS[index].x_coordinate, "Expected X coordinates must be equal");
			assert.equal(positionsY[index], potentialFromJS[index].y_coordinate, "Expected Y coordinates must be equal");
		}
	 });


	if("... should fail if user doesn't have images", async ()  => {
		let potentialAssets = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

	});

	

});
