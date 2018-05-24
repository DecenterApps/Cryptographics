const BITS_PER_ID = 24;

const BigInt = require('big-integer');

const bin2Hex = (bin, l) => (new BigInt(bin, 2)).toString(16).padStart(l, 0);
const hex2Bin = (bin, l) => (new BigInt(bin, 16)).toString(2).padStart(l, 0);
const bin2dec = bin => parseInt(bin, 2);


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

arr = [1,2,3,4,5,6,7,8];

function encode(arr) {
    let bits = convertInputToBin(arr);
    let strings = chunkString(bits,240);
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
    console.log(decoded);
    return decoded;
}
//
// decode(["0x0000000000000000000001000002000003000004000005000006000007000008",
// "0x0000000000000000000001000002000003000004000005000006000007000008"]);

module.exports = {
    encode, decode
}
