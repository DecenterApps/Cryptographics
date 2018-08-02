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
  let background;
  let end = 0;
  const helper = arr.slice();
  for (let i = helper.length - 1; i >= end; i -= 1) {
    if (helper[i].isBackground) {
      background = helper[i];
      helper.splice(i, 1);
      helper.unshift(background);
      i++;
      end++;
    }
  }
  return helper;
};

export const preloadImages = (arr) => {
  let loadedImages = 0;
  let callback = () => {};

  function imageloadpost() {
    loadedImages++;
    if (loadedImages === arr.length) {
      callback(arr); //call postaction and pass in images array as parameter
    }
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i].image.onload = function () {
      imageloadpost();
    };
    arr[i].image.onerror = function () {
      imageloadpost();
      arr[i].image.failed = true;
    };
  }
  return { //return blank object with done() method
    done: function (f) {
      callback = f || callback; //remember user defined callback functions to be called when images load
    }
  };
};
