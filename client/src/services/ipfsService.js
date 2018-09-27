const replicationNodes = [
  'https://ipfs.decenter.com',
];

export const bootstrapNodes = [
  '/dns4/ipfs.decenter.com/tcp/4443/wss/ipfs/QmWv5BiGHbZNQKg48cA1FLJaiM7aBj4NNDc1HmBkxbxhLz',
];

export const getHash = async (data) =>
  new Promise((resolve, reject) => {
    window.node.files.add([Buffer.from(data, 'base64')], { onlyHash: true }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data[0].hash);
    });

  });

export const uploadFile = async (data) =>
  new Promise((resolve, reject) => {
    window.node.files.add([Buffer.from(data, 'base64')], async (err, uploadedFile) => {
      // window.node.files.add([Buffer.from(data)], (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }
      const { hash } = uploadedFile[0];
      await replicate(hash, 'file');
      resolve(hash);
    });
  });

export const uploadJSON = async (data) =>
  new Promise((resolve, reject) => {
    // window.node.files.add([Buffer.from(data, 'base64')], (err, uploadedFile) => {
    window.node.files.add([Buffer.from(data)], async (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }
      const { hash } = uploadedFile[0];
      await replicate(hash, 'file');
      resolve(hash);
    });
  });

export const replicate = async (hash, type) => {
  let successful = 0;
  const replicationPromises = replicationNodes.map(node =>
    new Promise((resolve) => {
      const url = `${node}${type === 'file' ?
        '/api/v0/get?arg=' : '/api/v0/object/get?arg='}${hash}`;
      return fetch(url, { method: 'head', mode: 'no-cors' })
        .then(() => {
          successful += 1;
          console.log(`Successfully replicated ${type} with hash: ${hash} on ${successful}/${replicationNodes.length} nodes`);
          resolve(true);
        })
        .catch((error) => {
          console.error(`Failed replicating ${type} with hash: ${hash} on a node ${url}`);
          console.error(error);
          resolve(false);
        });
    }),
  );
  return Promise.all(replicationPromises);
};

export const getFileContent = (hash) =>
  new Promise(async (resolve, reject) => {
    const ipfsTimeout = setTimeout(() => {
      reject('Couldn\'t fetch data. (TIMEOUT)');
    }, 5000);
    try {
      const file = await window.node.files.cat(hash);
      clearTimeout(ipfsTimeout);
      resolve(new TextDecoder('utf-8').decode(file));
    } catch (e) {
      reject(e.message);
    }
  });