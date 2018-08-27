import { ipfsNodePath } from '../../config/constants';

const Web3 = require('web3');

export const resizeCanvas = (oldCanvas, width, height) => {

  //create a new canvas
  const newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d');

  //set dimensions
  newCanvas.width = width;
  newCanvas.height = height;

  //apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0, width, height);

  //return the new canvas
  return newCanvas;
};

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

export const uniq = (a) => {
  let seen = {};
  return a.filter((item) => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

export const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const shuffleBackgrounds = (arr) => {
  const helper = [...arr];
  const backgrounds = [];
  let end = helper.length;
  for (let i = 0; i < end; i++) {
    if (helper[i].isBackground) {
      backgrounds.push(helper[i]);
      helper.splice(i, 1);
      i--;
      end--;
    }
  }
  console.log(helper, backgrounds);

  return [...shuffleArray(backgrounds), ...helper];
};

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

export const preloadAssets = (assets) => {
  let images = [];
  for (let i = 0; i < assets.length; i++) {
    let image = new Image();

    image.src = `${assets[i].src}`;
    image.crossOrigin = 'Anonymous';
    images.push({
      image,
    });
  }
  preloadImages(images);
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

export function paginateArray(arrayItems, currentPage, showPerPage) {
  let start = (currentPage - 1) * showPerPage;
  let end = start + showPerPage;
  return arrayItems.slice(start, end);
};
