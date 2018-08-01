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

export const sortBy = (arr, p) => {
  return arr.sort((a, b) => {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
};