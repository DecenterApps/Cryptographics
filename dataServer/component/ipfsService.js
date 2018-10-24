const ipfsAPI = require('ipfs-api');
const { StringDecoder } = require('string_decoder');

const node = ipfsAPI('ipfs.decenter.com', '50001', { protocol: 'https' });

const getFileContent = (hash) =>
  new Promise(async (resolve, reject) => {
    const ipfsTimeout = setTimeout(() => {
      reject('Couldn\'t fetch data. (TIMEOUT)');
    }, 20000);
    try {
      const file = await node.files.cat(hash);
      clearTimeout(ipfsTimeout);
      resolve(new StringDecoder('utf-8').write(file));
    } catch (e) {
      reject(e.message);
    }
  });

module.exports = { getFileContent };
