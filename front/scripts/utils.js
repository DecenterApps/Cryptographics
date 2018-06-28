const BITS_PER_ID = 24;

const bs58 = require('bs58');
const BigInt = require('big-integer');

const bin2Hex = (bin, l) => (new BigInt(bin, 2)).toString(16).padStart(l, 0);
const hex2Bin = (bin, l) => (new BigInt(bin, 16)).toString(2).padStart(l, 0);
const bin2dec = bin => parseInt(bin, 2);

function hex2dec(seed){
    let s= seed.toString().substr(2);
    let x = new BigInt(s,16).toString();
    return x;
}

function toSize(number,size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function dec2bin(dec){
    bits = (dec >>> 0).toString(2);
    return toSize(bits,BITS_PER_ID);
}


function convertInputToBin(arr){
    var solution = "";
    for(var i=0; i<arr.length; i++){
        solution= solution + dec2bin(arr[i]);
    }
    return solution;
}


function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

// arr = [1,2,3,4,5,6,7,8];

function encode(arr) {
    let bits = convertInputToBin(arr);
    let strings = chunkString(bits,240);
    if(strings == null) {
        return arr;
    }
    for(let i=0; i<strings.length; i++){
        strings[i] = bin2Hex(strings[i]);
        while(strings[i].length < 64){
            strings[i] = "0" + strings[i];
        }
        strings[i] = "0x" + strings[i];
    }
    return strings;
}

function decode(arr) {
    var decoded = [];
    var limit = arr.length;
    for(let i=0; i<limit; i++) {
        var x = hex2Bin(arr[i].substr(2));
        while (x.length % 24 != 0) {
            x = "0" + x;
        }
        var numbers = chunkString(x, 24);
        for (let i = 0; i < numbers.length; i++) {
            // console.log(numbers[i] + "   " + bin2dec(numbers[i]));
            decoded.push(bin2dec(numbers[i]));
        }
    }
    return decoded;
}

//Function to pick 10 random numbers between 0,100
function pickRandomHashes() {
    let arr = [];
    for(let i=0; i<10; i++){
        arr.push(Math.floor(Math.random() * 100));
    }
    return arr;
}

function getIpfsHashFromBytes32(bytes32Hex) {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2);
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

function getBytes32FromIpfsHash(ipfsHash) {
    return "0x"+bs58.decode(ipfsHash).slice(2).toString('hex')
}
//
// decode(["0x0000000000000000000001000002000003000004000005000006000007000008",
// "0x0000000000000000000001000002000003000004000005000006000007000008"]);

console.log(encode([1,2,3,4,5,6,7,8,9,10]));


// console.log(encode([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]));
module.exports = {
    encode, decode, hex2dec, pickRandomHashes, getIpfsHashFromBytes32, getBytes32FromIpfsHash
}
