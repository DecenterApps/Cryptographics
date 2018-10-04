const fs = require('fs');
const request = require('request');
const readline = require('readline');
const config = require('./config.json');
const utils = require('../src/services/utils');
const Web3 = require('web3');
const sharp = require('sharp');
const sizeOf = require('image-size');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');


const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/ce2cJSQZefTbWxpnI1dZ`));

const assetManagerContractAddress = config.assetManagerContract.networks['1'].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getFileContent = async (hash) => {
  // const ipfsTimeout = setTimeout(() => {
  //   throw Error('Couldn\'t fetch data. (TIMEOUT)');
  // }, 20000);
  try {
    const file = await window.node.files.cat(hash);
    // clearTimeout(ipfsTimeout);
    return new TextDecoder('utf-8').decode(file);
  } catch (e) {
    throw Error(e.message);
  }
};

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const getAssetPackData = async (assetPackId) => {
  let response = await assetManagerContract().methods.getAssetPackData(assetPackId).call();
  const packCoverIpfs = utils.getIpfsHashFromBytes32(response[0]);
  const creator = response[1];
  const price = response[2];
  let ids = response[3];
  let metadata;
  try {
    const metadataIpfs = await getFileContent(response[6]);
    metadata = JSON.parse(metadataIpfs);
  } catch (e) {
    metadata = {
      name: '',
      description: '',
    };
  }
  let assets = [];
  for (let i = 0; i < ids.length; i++) {
    let ipfsHash = utils.getIpfsHashFromBytes32(response[5][i]);
    assets.push({
      id: ids[i],
      attribute: response[4][i],
      ipfsHash: ipfsHash,
      src: `https://ipfs.decenter.com/ipfs/${ipfsHash}`
    });
  }
  return {
    packName: metadata.name,
    packCoverIpfs,
    packCoverSrc: `https://ipfs.decenter.com/ipfs/${packCoverIpfs}`,
    creator,
    price: web3.utils.fromWei(price, 'ether'),
    id: assetPackId,
    assets,
  };
};

const getAssetPackIds = () =>
  new Promise((resolve, reject) => {
    rl.question('Enter asset pack IDs (number) separated by a space: ', (answer) => {
      const assetPacks = answer.split(' ').filter(item => item !== '').map(item => parseInt(item, 10));
      console.log('Packs selected: ', assetPacks);
      resolve(assetPacks);
      rl.close();
    });
  });

const download = (uri, filename, callback) => {
  request.head(uri, function (err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback)
      .on('error', callback);
  });
};

const downloadAssetPack = async (assetId) =>
  new Promise(async (resolve, reject) => {
    let downloaded = 0;
    let fetchData = await getAssetPackData(assetId);
    let assetPackData = fetchData.assets;
    assetPackData.forEach((item, i) => {
      const path = `${__dirname}/../src/assets/landingart/${assetId}`;
      assetPackData[i].src = `assets/landingart/${assetId}/${item.id}.png`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      download(
        `https://ipfs.decenter.com/ipfs/${item.ipfsHash}`,
        `${path}/big-${item.id}.png`,
        async (err, data) => {
          if (err !== undefined) console.log(err);
          const dimensions = sizeOf(`${path}/big-${item.id}.png`);
          sharp(`${path}/big-${item.id}.png`)
          .resize(Math.floor(dimensions.width / 10), Math.floor(dimensions.height / 10))
          .toFile(`${path}/${item.id}.png`, (err, info) => {
            if (err) throw err;
            downloaded++;
            if (downloaded === assetPackData.length - 1) resolve(fetchData);
          });
        }
      );
    });
  });

const readFiles = (dirname) =>
  new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, folderNames) => {
      const data = [];
      if (err) {
        return console.log('Cannot read directory', dirname);
      }
      folderNames.forEach((filename, i) => {
        fs.readdir(`${dirname}/${filename}`, (err, filenames) => {
          data.push({
            id: filename,
            filenames: filenames,
          });
          if (i === folderNames.length - 1) resolve(data);
        });
      });
    });
  });

const buildConfig = async () => {
  const path = `${__dirname}/../src/assets/landingart/`;
  deleteFolderRecursive(path);
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  let assetPackIds = process.argv.slice(2);
  if (assetPackIds.length === 0) {
    assetPackIds = await getAssetPackIds();
  }
  rl.close();
  console.log('Downloading images...');
  const promises = assetPackIds.map(async assetPackId => await downloadAssetPack(assetPackId));
  const assetPackData = await Promise.all(promises);
  console.log('Download complete!');

  console.log('Compressing...');
  const compressPromises = assetPackIds.map(async assetPackId => {
    imagemin([`${__dirname}/../src/assets/landingart/${assetPackId}/*.{jpg,png}`],
      `${__dirname}/../src/assets/landingart/${assetPackId}/`, {
      plugins: [imageminPngquant({quality: '90'})]
    });
  });
  await Promise.all(compressPromises);
  console.log('Done!');

  fs.writeFile(`${__dirname}/landingAssetPacks.json`, JSON.stringify(assetPackData), (err) => {
    if (err) throw err;
    console.log('Success!');
  });
};

buildConfig();