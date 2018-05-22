const BITS_PER_ID = 24;

const BigInt = require('big-integer');

const bin2Hex = (bin, l) => (new BigInt(bin, 2)).toString(16).padStart(l, 0);


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
    var bits = convertInputToBin(arr);
    var strings = chunkString(bits,240);
    for(var i=0; i<strings.length; i++){
        strings[i] = bin2Hex(strings[i]);
        while(strings[i].length < 64){
            strings[i] = "0" + strings[i];
        }
        strings[i] = "0x" + strings[i];
        console.log(strings[i]);
    }
    return strings;
}

encode(arr);

module.exports = {
    encode
}
