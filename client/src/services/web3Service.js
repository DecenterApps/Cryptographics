import Web3 from 'web3';

import ProviderEngine from 'web3-provider-engine';
import RpcSubProvider from 'web3-provider-engine/subproviders/rpc';
import CacheProvider from 'web3-provider-engine/subproviders/cache';
import SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions';
import { default as WalletConnectSubprovider } from '@walletconnect/web3-subprovider';

import clientConfig from '../../config/clientConfig.json';

export const getBrowserProviderName = () => {
  const provider = window.ethereum || (window.web3 && window.web3.currentProvider);

  if (!provider) return 'Browser';

  if (provider.isStatus) return 'Status';
  if (provider.isImToken) return 'imToken';
  if (provider.isTrust) return 'Trust';
  if (provider.isToshi) return 'Coinbase';
  if (provider.isTokenary) return 'Tokenary';
  if (navigator.userAgent.match(/Opera|OPR/)) return 'Opera';
  if (provider.isRabby) return 'Rabby';
  if (provider.isFrame) return 'Frame';
  if (provider.isXDEFI || typeof provider.isXDEFI === 'boolean') return 'XDEFI';

  // leave at last place because some providers set this as true in addition to their own flag
  // ie. Rabby sets both isRabby and isMetamask as true
  if (provider.isMetaMask) return 'MetaMask';

  return 'Browser';
};

export const setWeb3toMetamask = () => {
  if (!window.ethereum && (!window.web3 || !window.web3.currentProvider)) throw new Error('No wallet found.');
  window._web3 = new Web3(window.ethereum || window.web3.currentProvider);
};

export const setupWeb3 = () => {
  console.log('setupWeb3');
  window._web3 = new Web3(clientConfig.rpcHttpProvider);
};

export const setupWeb3WithSubProvider = (subProvider) => {
  const engine = new ProviderEngine({
    pollingInterval: 10 * 1000,
  });
  engine.on('error', console.error);
  engine.addProvider(new CacheProvider());
  engine.addProvider(new SubscriptionSubprovider());

  if (subProvider) engine.addProvider(subProvider);
  engine.addProvider(new RpcSubProvider({ rpcUrl: clientConfig.rpcHttpProvider }));
  engine.start();

  window._web3 = new Web3(engine);
  window._web3.eth.transactionConfirmationBlocks = 5;
};

export const setupWalletConnect = async () => {
  WalletConnectSubprovider.prototype.updateState = () => {};
  WalletConnectSubprovider.prototype.emit = () => {};
  setupWeb3WithSubProvider(new WalletConnectSubprovider({
    bridge: 'https://bridge.walletconnect.org',
  }));
};

export const isMetaMaskApproved = async () => {
  try {
    // legacy window.web3.currentProvider or no provider
    if (!window.ethereum || !window.ethereum.enable) return true;

    // should return address if approved
    if (window.ethereum.selectedAddress) return true;

    // returns [] if not approved
    const { result: [account] } = await window.ethereum.send({ method: 'eth_accounts' });
    return !!account;
  } catch (err) {
    return false;
  }
};

export const metamaskApprove = async () => {
  if (window.ethereum) return window.ethereum.enable();
}

export const getNetwork = () => window._web3.eth.net.getId();

export const getAccount = () => (
  new Promise(async (resolve, reject) => {
    try {
      const accounts = await window._web3.eth.getAccounts();
      if (!accounts.length) throw new Error('No accounts');
      resolve(accounts[0]);
    } catch (err) {
      reject(err);
    }
  })
);
