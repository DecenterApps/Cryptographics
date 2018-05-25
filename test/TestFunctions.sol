pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Utils/Functions.sol";


contract TestFunctions {

   function testDecodeAssets() public {
        Functions f = Functions(DeployedAddresses.Functions());
        bytes32 a = 0x0000000000000000000000000000000000000000000001000002000003000004;
        bytes32 b = 0x0000000000000000000001000002000003000004000005000006000007000008;
        bytes32[] memory encoded = new bytes32[](2);
        encoded[0] = a;
        encoded[1] = b;
        uint[] memory decoded = f.decodeAssets(encoded);
        //           0  1  2  3  4  5  6  7  8  9  10 11
        //decoded = [4, 3, 2, 1, 8, 7, 6, 5, 4, 3, 2, 1]
        Assert.equal(decoded[0],4,"Good parsed");
        Assert.equal(decoded[1],3,"Good parsed");
        Assert.equal(decoded[2],2,"Good parsed");
        Assert.equal(decoded[3],1,"Good parsed");
        Assert.equal(decoded[4],8,"Good parsed");
        Assert.equal(decoded[5],7,"Good parsed");
        Assert.equal(decoded[8],4,"Good parsed");

   }
    function testGetFinalSeed() public {
        Functions f = Functions(DeployedAddresses.Functions());
        uint seed = 12345678910;
        uint iterations = 5;
        uint p = uint(f.getFinalSeed(seed, iterations));
        uint lastSeed = 4773053497971290520688832548689611456032191880236429716174794716194325807027;
        Assert.equal(p,lastSeed,"Good calculation of final seed");
    }

    function testLen() public {
        Functions f = Functions(DeployedAddresses.Functions());
        if (f.getLen() == 0){
            f.fillRadnomHashes();
        }
        uint len = f.getLen();

        Assert.equal(100, len, "not good");
    }
}
