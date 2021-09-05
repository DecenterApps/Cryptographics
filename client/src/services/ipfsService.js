import ipfsAPI from 'ipfs-http-client';

const node = ipfsAPI.create({
  host: 'ipfs.decenter.com',
  port: '50001',
  protocol: 'https',
});

const replicationNodes = [
  'https://ipfs.decenter.com',
  'https://ipfs.io',
  'https://ipfs.infura.io:5001',
];

export const bootstrapNodes = [
  '/dns4/ipfs.decenter.com/tcp/4443/wss/ipfs/QmWv5BiGHbZNQKg48cA1FLJaiM7aBj4NNDc1HmBkxbxhLz',
];

export const getHash = async (data) =>
  new Promise((resolve, reject) => {
    node.add([Buffer.from(data, 'base64')], { onlyHash: true, progress: (a) => console.log(`received: ${a}`) })
    .then(       (res) => {
      console.log(res);
      resolve(res.path);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    })
  });

export const uploadFile = async (data) =>
  new Promise((resolve, reject) => {
    node.add([Buffer.from(data, 'base64')], { progress: (a) => console.log(`received: ${a}`) }).then(async (res) => {
      console.log(res);
      resolve(res.path);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    })
  });

export const uploadJSON = async (data) =>
  new Promise((resolve, reject) => {
    if (typeof data === 'object') data = JSON.stringify(data);
    node.add([Buffer.from(data)], { progress: (a) => console.log(`received: ${a}`) })
    .then(async (res) => {
      console.log(res);
      const { path } = res;
      try { await replicate(path, 'file'); } catch (e) { reject(e); }
      resolve(path);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
  });

// TODO - allow pinning this way - await node.pin.add(res.cid)? (nginx is throwing cors)
/*
 Replicates given hash on at least one node
 */
export const replicate = async (hash, type) =>
  new Promise((resolve, reject) => {
    let successful = 0;
    let failed = 0;
    replicationNodes.map(node => {
      const url = `${node}${type === 'file' ? '/api/v0/get?arg=' : '/api/v0/object/get?arg='}${hash}`;
      return fetch(url, { method: 'head', mode: 'no-cors' })
        .then(() => {
          successful += 1;
          console.log(`Successfully replicated ${type} with hash: ${hash} on ${successful}/${replicationNodes.length} nodes`);
          resolve(node);
        })
        .catch((error) => {
          failed += 1;
          console.error(`Failed replicating ${type} with hash: ${hash} on a node ${url}`);
          console.error(error);
          if (failed === replicationNodes.length)
            reject(new Error(`Failed replicating ${type} with hash: ${hash} on all nodes`));
        });
    });
  });

export const getFileContent = (hash) =>
  new Promise(async (resolve, reject) => {
    const ipfsTimeout = setTimeout(() => {
      reject('Couldn\'t fetch data. (TIMEOUT)');
    }, 20000);
    try {
      // console.log(node, hash);
      // const file = await node.files.read([hash]); // TODO for unknown reason this returns read { [suspended] }
      // console.log(file);
      // resolve(new TextDecoder('utf-8').decode(file));
      const req = await fetch(`https://ipfs.decenter.com/ipfs/${hash}`);
      if (!req.ok) throw new Error('failed fetching');
      const response = await req.json();
      clearTimeout(ipfsTimeout);
      resolve(JSON.stringify(response));
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });

window.testIpfs = async (_file) => {
  const file = _file || { 'test': '123' };
  const hash = await uploadJSON(file);
  console.log('test hash: ', hash);
  const json = await getFileContent(hash);
  console.log('test file: ', json);
};
