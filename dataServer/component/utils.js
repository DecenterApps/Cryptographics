const BigInt = require('big-integer');
const bs58 = require('bs58');
const {
  DEFAULT_AVATAR, DEFAULT_USERNAME, ipfsNodePath,
} = require('./constants');

const isEmptyBytes = (string) => string === '0x0000000000000000000000000000000000000000000000000000000000000000';

const hex2dec = (seed) => {
  let s = seed.toString().substr(2);
  return new BigInt(s, 16).toString();
};

const getIpfsHashFromBytes32 = (bytes32Hex) => {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = '1220' + bytes32Hex.slice(2);
  const hashBytes = Buffer.from(hashHex, 'hex');
  return bs58.encode(hashBytes);
};

const mapUserInfo = userInfoTx => {
  const username = userInfoTx[0] || DEFAULT_USERNAME;

  const isImageEmptyBytes = isEmptyBytes(userInfoTx[1]);
  const avatar = isImageEmptyBytes ? DEFAULT_AVATAR : `${ipfsNodePath}${getIpfsHashFromBytes32(userInfoTx[1])}`;

  return { username, avatar };
};

const hex2Bin = (bin, l) => (new BigInt(bin, 16)).toString(2).padStart(l, 0);
const bin2dec = bin => parseInt(bin, 2);
const chunkString = (str, length) => str.match(new RegExp('.{1,' + length + '}', 'g'));

const decode = (arr) => {
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
};

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  mapUserInfo,
  getIpfsHashFromBytes32,
  decode,
  isEmptyBytes,
  hex2dec,
  wait,
};
