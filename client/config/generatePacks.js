const fs = require('fs');
const request = require('request');
const readline = require('readline');
const config = require('./config.json');
const utils = require('../src/services/utils');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/ce2cJSQZefTbWxpnI1dZ`));

const assetManagerContractAddress = config.assetManagerContract.networks['42'].address;
const assetManagerContract = () => new web3.eth.Contract(config.assetManagerContract.abi, assetManagerContractAddress);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  let ids = response[1];
  let assets = [];
  for (let i = 0; i < ids.length; i++) {
    assets.push({
      packName: response[0],
      id: response[1][i],
      attribute: response[2][i],
      ipfsHash: utils.getIpfsHashFromBytes32(response[3][i]),
    });
  }
  return assets;
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
    let assetPackData = await getAssetPackData(assetId);
    assetPackData.forEach((item, i) => {
      const path = `${__dirname}/../src/assets/landingart/${assetId}`;
      assetPackData[i].src = `assets/landingart/${assetId}/${item.id}.png`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      download(
        `https://ipfs.decenter.com/ipfs/${item.ipfsHash}`,
        `${path}/${item.id}.png`,
        (err, data) => {
          downloaded++;
          if (err !== undefined) console.log(err);
          if (downloaded === assetPackData.length - 1) resolve({
            id: assetId,
            assets: assetPackData
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
  console.log('Download complete !');

  fs.writeFile(`${__dirname}/landingAssetPacks.json`, JSON.stringify(assetPackData), (err) => {
    if (err) throw err;
    console.log('Success!');
  });
};

buildConfig();