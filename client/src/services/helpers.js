const Web3 = require('web3');

export function checkProvider() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider);
    if (window.web3.currentProvider.isMetaMask) {
      console.log('Succesfully using MetaMask');
    }
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.decenter.com'));
    console.log('Please install MetaMask');
  }
}

export function getAccounts() {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data[0]);
    });
  });
}

export const moveBackgrounds = (arr) => {
  const helper = arr.slice();
  for (let i = helper.length - 1; i > 0; i -= 1) {
    console.log(helper[i]);
    if (helper[i].background.substr(0, 1) === '1') {
      console.log('ADDED');
      const background = helper[i];
      helper.splice(i, 1);
      helper.unshift(background);
    }
  }
  return helper;
};