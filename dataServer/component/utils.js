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

function getDateDiff(_previous) {
  const current = new Date();
  const previous = new Date(_previous * 1000);

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed/1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }

  else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed/msPerMinute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  else if (elapsed < msPerDay ) {
    const hours = Math.round(elapsed/msPerHour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed/msPerDay);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  else if (elapsed < msPerYear) {
    const months = Math.round(elapsed/msPerMonth);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  else {
    const years = Math.round(elapsed/msPerYear);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

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

module.exports = {
  mapUserInfo,
  getIpfsHashFromBytes32,
  getDateDiff,
  decode,
  isEmptyBytes,
  hex2dec,
};
