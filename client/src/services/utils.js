const BITS_PER_ID = 24;

const bs58 = require('bs58');
const BigInt = require('big-integer');

const bin2Hex = (bin, l) => (new BigInt(bin, 2)).toString(16).padStart(l, 0);
const hex2Bin = (bin, l) => (new BigInt(bin, 16)).toString(2).padStart(l, 0);
const bin2dec = bin => parseInt(bin, 2);

function hex2dec(seed) {
  let s = seed.toString().substr(2);
  return new BigInt(s, 16).toString();
}

function toSize(number, size) {
  let s = String(number);
  while (s.length < (size || 2)) {s = '0' + s;}
  return s;
}

function dec2bin(dec) {
  let bits = (dec >>> 0).toString(2);
  return toSize(bits, BITS_PER_ID);
}

function convertInputToBin(arr) {
  let solution = '';
  for (let i = 0; i < arr.length; i++) {
    solution = solution + dec2bin(arr[i]);
  }
  return solution;
}

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function encode(arr) {
  let bits = convertInputToBin(arr);
  let strings = chunkString(bits, 240);
  if (strings == null) {
    return arr;
  }
  for (let i = 0; i < strings.length; i++) {
    strings[i] = bin2Hex(strings[i]);
    while (strings[i].length < 64) {
      strings[i] = '0' + strings[i];
    }
    strings[i] = '0x' + strings[i];
  }
  return strings;
}

function decode(arr) {
  let decoded = [];
  let limit = arr.length;
  for (let i = 0; i < limit; i++) {
    let x = hex2Bin(arr[i].substr(2));
    while (x.length % 24 !== 0) {
      x = '0' + x;
    }
    let numbers = chunkString(x, 24);
    for (let i = 0; i < numbers.length; i++) {
      decoded.push(bin2dec(numbers[i]));
    }
  }
  return decoded;
}

function pickRandomHashes() {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

function getIpfsHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = '1220' + bytes32Hex.slice(2);
  const hashBytes = Buffer.from(hashHex, 'hex');
  return bs58.encode(hashBytes);
}

function getBytes32FromIpfsHash(ipfsHash) {
  return '0x' + bs58.decode(ipfsHash).slice(2).toString('hex');
}

const timeConverter = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
  const year = a.getFullYear();
  const month = a.getMonth();
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();

  return `${date}/${month}/${year}, ${hour}:${min}`;
};

const isEmptyBytes = (string) => string === '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Formats small numbers example: 0.0000000001 number to 0.0000000001 string instead of the
 * usual JS conversion to 1e-9
 *
 * @param {Number} incomingOutput
 * @return {String}
 */
const formatSmallNumber = (incomingOutput) => parseFloat(incomingOutput).toFixed(3).replace(/\.?0*$/g, '');

function scientificToDecimal(num) {
  if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    let zero = '0',
        parts = String(num).toLowerCase().split('e'),
        e = parts.pop(),
        l = Math.abs(e),
        sign = e/l,
        coeff_array = parts[0].split('.');
    if(sign === -1) {
        coeff_array[0] = Math.abs(coeff_array[0]);
        num = '-'+zero + '.' + new Array(l).join(zero) + coeff_array.join('');
    }
    else {
        let dec = coeff_array[1];
        if(dec) l = l - dec.length;
        num = coeff_array.join('') + new Array(l+1).join(zero);
    }
  }
  return num;
};

const padToFour = (number) => { return number <= 9999 ? ('000' + number).slice(-4) : number; };

const encodeQueryString = (params) => {
  const keys = Object.keys(params).filter(key => params[key]);
  return keys.length
    ? `?${keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&')}`
    : '';
};

module.exports = {
  encode,
  decode,
  hex2dec,
  pickRandomHashes,
  getIpfsHashFromBytes32,
  getBytes32FromIpfsHash,
  timeConverter,
  isEmptyBytes,
  formatSmallNumber,
  padToFour,
  scientificToDecimal,
  encodeQueryString,
};