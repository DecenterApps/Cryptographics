const replicationNodes = [
  'https://ipfs.decenter.com',
];

export const bootstrapNodes = [
  '/dns4/ipfs.decenter.com/tcp/4443/wss/ipfs/QmWv5BiGHbZNQKg48cA1FLJaiM7aBj4NNDc1HmBkxbxhLz',
];

export const uploadFile = async (data) =>
  new Promise((resolve, reject) => {
    window.node.files.add([Buffer.from(data, 'base64')], (err, uploadedFile) => {
      // window.node.files.add([Buffer.from(data)], (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }
      const { hash } = uploadedFile[0];
      replicate(hash, 'file');
      resolve(hash);
    });
  });

export const uploadJSON = async (data) =>
  new Promise((resolve, reject) => {
    // window.node.files.add([Buffer.from(data, 'base64')], (err, uploadedFile) => {
    window.node.files.add([Buffer.from(data)], (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }
      const { hash } = uploadedFile[0];
      replicate(hash, 'file');
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
          resolve();
        })
        .catch((error) => {
          console.error(error);
          resolve();
        });
    }),
  );
  Promise
    .all(replicationPromises)
    .then(() =>
      console.log(`Successfully replicated ${type} with hash: ${hash} on ${successful}/${replicationNodes.length} nodes`)
    );
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