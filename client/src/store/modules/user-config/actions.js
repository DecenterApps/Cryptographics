import {
  SILENT_LOGIN,
  LOG_OUT,
  LOGIN_METAMASK,
  SET_PROVIDER,
  SET_ADDRESS,
  SET_USERNAME,
  SET_AVATAR,
  SET_USER_CONFIG,
  SET_CREATED_ASSETS_PACKS_IDS,
  SET_BOUGHT_ASSETS_PACKS_IDS,
  SET_APPROVAL,
  UPDATE_USER_CONFIG,
  CHECK_USERNAME_EXISTENCE,
  EDIT_PROFILE,
  MUTATE_ADDRESS,
  MUTATE_USERNAME,
  MUTATE_AVATAR,
  MUTATE_USERNAME_EXISTENCE,
  MUTATE_EDIT_PROFILE_RESULT,
  MUTATE_CREATED_ASSETS_PACKS_IDS,
  MUTATE_BOUGHT_ASSETS_PACKS_IDS,
  MUTATE_APPROVAL,
  SET_NEW_USERNAME,
  SET_NETWORK,
  MUTATE_NETWORK,
  FETCH_BALANCES,
  MUTATE_BALANCES,
  PUSH_NOTIFICATION,
  MUTATE_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  MUTATE_CONNECT_PROVIDER,
  MUTATE_CONNECT_PROVIDER_SUCCESS,
  MUTATE_LOGGING_IN,
  SET_ACC_CHANGE,
} from './types';
import { TOGGLE_MODAL, TOGGLE_LOADING_MODAL, HIDE_LOADING_MODAL } from '../modal/types';
import { DEFAULT_AVATAR, DEFAULT_USERNAME, ipfsNodePath } from 'config/constants';
import { testnets } from '../../../../config/constants';
import clientConfig from '../../../../config/clientConfig.json';

import { parseError, isMobileDevice, checkProvider } from '../../../services/helpers';
import { getIpfsHashFromBytes32 } from '../../../services/utils';
import {
  getUsername, getAvatar, usernameExists, registerUser, getCreatedAssetPacks, getBoughtAssetPacks, userBalances,
} from '../../../services/ethereumService';
import {
  isMetaMaskApproved, metamaskApprove, setWeb3toMetamask, getAccount, setupWeb3, getNetwork,
} from '../../../services/web3Service';
import { LS_ACCOUNT_TYPE } from './state';
import { addToLsState } from '../../../services/localStorageService';

export default {
  [SILENT_LOGIN]: async ({ dispatch, commit, state }) => {
    console.log('SILENT_LOGIN');
    const { accountType, address } = state;
    if (address) return;

    commit(MUTATE_LOGGING_IN, { loggingIn: true, accountType });

    try {
      switch (accountType) {
        case 'metamask': {
          await dispatch(LOGIN_METAMASK, true);
          break;
        }

        default:
          console.error('Unknown wallet type', accountType);
      }
    } catch (err) {
      console.error(err);
    } finally {
      commit(MUTATE_LOGGING_IN, { loggingIn: false, accountType });
    }
  },
  [LOGIN_METAMASK]: async ({ commit, dispatch }, silent) => {
    console.log('LOGIN_METAMASK');
    const accountType = 'metamask';
    commit(MUTATE_CONNECT_PROVIDER);
    // const walletType = getBrowserProviderName();
    //
    // console.log('walletType', walletType);

    try {
      const metaMaskApproved = await isMetaMaskApproved();

      if (silent && !metaMaskApproved) {
        throw new Error('Provider not approved');
      }

      await metamaskApprove();
      setWeb3toMetamask();

      const network = await getNetwork();

      if (clientConfig.network !== network) {
        throw new Error(`Wrong network - ${testnets[network]}`);
      }

      const address = await getAccount();

      if (!silent) console.log('not silent');
      await dispatch(SET_PROVIDER, { address, accountType });
    } catch (err) {
      await dispatch(SET_PROVIDER, { address: undefined, accountType: undefined });

      setupWeb3();

      if (!silent) {
        let errorMessage = err.message || err;
        if (errorMessage.includes('User denied account authorization')) {
          errorMessage = 'Denied login';
        }
        if (errorMessage.includes('wallet address undefined')) {
          errorMessage = 'No accounts locked';
        }
        // notify(errorMessage, 'error')(dispatch);
        // if (getBrowserProviderName() === 'Browser' && isMobileDevice()) dispatch(openNonWeb3ProviderModal());
      }

      console.error(err);
      throw new Error(err);
    }
  },
  [SET_PROVIDER]: async ({ dispatch, commit }, payload) => {
    console.log('SET_PROVIDER', payload);
    const { address, accountType } = payload;

    commit(MUTATE_CONNECT_PROVIDER_SUCCESS, { address, accountType, network: clientConfig.network });

    // dispatch(postLogin());

    // addToLsState({
    //   address,
    // });
    localStorage.setItem(LS_ACCOUNT_TYPE, accountType);
    // localStorage.setItem(LS_ADDRESS, accountType);
  },
  [LOG_OUT]: ({ commit, state }) => {
    console.log('LOG_OUT');
    const { accountType } = state;
    if (accountType === 'walletconnect') {
      if (window && window._web3 && window._web3.currentProvider && window._web3.currentProvider.connection && window._web3.currentProvider.connection.close)
        window._web3.currentProvider.connection.close();
      localStorage.removeItem('walletconnect');
    }
    if (accountType === 'coinbase') {
      if (window && window._web3 && window._web3.currentProvider && window._web3.currentProvider.close)
        window._web3.currentProvider.close();
      localStorage.removeItem(LS_ACCOUNT_TYPE);
    }
    commit(MUTATE_CONNECT_PROVIDER_SUCCESS, { address: undefined, accountType: undefined, network: clientConfig.network });
  },
  [SET_ACC_CHANGE]: async ({ dispatch, state }) => {
    if (window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        const { address, connectingProvider, accountType } = state;

        if (connectingProvider) return;

        if (accountType !== 'metamask') return;

        if (address && !accounts[0]) dispatch(LOG_OUT);
        if (accounts[0] !== address && await isMetaMaskApproved()) dispatch(LOGIN_METAMASK, false);
      });

      window.ethereum.on('chainChanged', async (chainId) => {
        if (state.accountType === 'metamask' && await isMetaMaskApproved()) {
          dispatch(LOGIN_METAMASK, false);
        }
      });
    } else {
      const interval = setInterval(async () => {
        const { address, connectingProvider, accountType } = state;

        if (connectingProvider) return;
        if (accountType !== 'metamask') return clearInterval(interval);

        const accounts = await window._web3.eth.getAccounts();

        if (address && !accounts[0]) window.location.reload();
        if (accounts[0] !== address) await dispatch(LOGIN_METAMASK, false);
      }, 1000);
    }
  },
  [SET_NEW_USERNAME]: async ({ commit, dispatch, state }, newUsername) => {
    await dispatch(CHECK_USERNAME_EXISTENCE, newUsername);

    if (newUsername.length > 20 || newUsername === '') {
      return commit(MUTATE_EDIT_PROFILE_RESULT, false);
    }

    if (!state.changeUsername.isExisting) {
      commit(MUTATE_USERNAME, newUsername);
      commit(MUTATE_EDIT_PROFILE_RESULT, true);
      setTimeout(() => dispatch(TOGGLE_MODAL), 1000);
    } else {
      commit(MUTATE_EDIT_PROFILE_RESULT, false);
    }
  },
  [SET_USERNAME]: async ({ commit, state }) => {
    console.log('SET_USERNAME', state.address);
    let username = state.address ? await getUsername(state.address) : '';
    if (username !== '') {
      commit(MUTATE_USERNAME, username);
    } else {
      let username = DEFAULT_USERNAME;
      commit(MUTATE_USERNAME, username);
    }
  },
  [SET_AVATAR]: async ({ commit, state }) => {
    const initialAvatarBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
    let avatarBytes32 = state.address ? await getAvatar(state.address) : initialAvatarBytes32;
    if (avatarBytes32 !== initialAvatarBytes32) {
      let avatar = ipfsNodePath + getIpfsHashFromBytes32(avatarBytes32);
      commit(MUTATE_AVATAR, avatar);
    } else {
      let avatar = DEFAULT_AVATAR;
      commit(MUTATE_AVATAR, avatar);
    }
  },
  [SET_CREATED_ASSETS_PACKS_IDS]: async ({ commit, state }) => {
    let createdIDs = await getCreatedAssetPacks(state.address);
    commit(MUTATE_CREATED_ASSETS_PACKS_IDS, [...createdIDs].reverse());
  },
  [SET_BOUGHT_ASSETS_PACKS_IDS]: async ({ commit, state }) => {
    let boughtIDs = await getBoughtAssetPacks(state.address);
    commit(MUTATE_BOUGHT_ASSETS_PACKS_IDS, [...boughtIDs].reverse());
  },
  [SET_APPROVAL]: async ({ commit }) => {
    // const metamaskApproved = await isMetaMaskApproved();
    // commit(MUTATE_APPROVAL, metamaskApproved);
  },
  [SET_USER_CONFIG]: async ({ dispatch }) => {
    await dispatch(SET_ACC_CHANGE);
    await dispatch(SILENT_LOGIN);
    console.log('ovde');
    console.log(window._web3);

    // dispatch(SET_APPROVAL);
    // dispatch(UPDATE_USER_CONFIG);
  },
  [UPDATE_USER_CONFIG]: async ({ dispatch, state }) => {
    dispatch(SET_AVATAR);
    dispatch(SET_USERNAME);
    dispatch(SET_CREATED_ASSETS_PACKS_IDS);
    dispatch(SET_BOUGHT_ASSETS_PACKS_IDS);
    // setInterval(async function () {
    //   let changedAddress = await getAccount();
    //   if (changedAddress !== state.address) {
    //     dispatch(SET_USER_CONFIG);
    //   }
    // }, 1000);
    // return true;
  },
  [CHECK_USERNAME_EXISTENCE]: async ({ commit, state }, newUsername) => {
    let isExisting = await usernameExists(newUsername);
    if (newUsername !== state.username && newUsername !== '') {
      commit(MUTATE_USERNAME_EXISTENCE, isExisting);
    } else if (newUsername === '') {
      let isExisting = false;
      commit(MUTATE_USERNAME_EXISTENCE, isExisting);
    }
  },
  [EDIT_PROFILE]: async ({ commit, dispatch, state }, { newUsername, newAvatarBytes32 }) => {
    try {
      dispatch(TOGGLE_MODAL, 'editProfile')
      dispatch(TOGGLE_LOADING_MODAL, 'Please confirm the transaction in MetaMask.');
      await dispatch(CHECK_USERNAME_EXISTENCE, newUsername);
      if (!state.changeUsername.isExisting) {
        if (newUsername === '') {
          newUsername = state.username;
        }
        if (newAvatarBytes32 === '') {
          if (state.avatar === DEFAULT_AVATAR) {
            const initialAvatarBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
            newAvatarBytes32 = initialAvatarBytes32;
          }
          if (state.avatar !== DEFAULT_AVATAR) {
            newAvatarBytes32 = await getAvatar(state.address);
          }
        }
      }
      const transactionPromise = await registerUser(newUsername, newAvatarBytes32, state.address);
      dispatch(HIDE_LOADING_MODAL);
      dispatch(PUSH_NOTIFICATION, {
        status: 'loading',
        message: 'Please wait while the transaction is written to the blockchain. Your profile will be updated shortly.'
      });
      const result = await transactionPromise();
      dispatch(REMOVE_NOTIFICATION, state.notification.length - 1);
      dispatch(PUSH_NOTIFICATION, {
        status: 'success',
        message: 'Your profile has been updated successfully.'
      });
      commit(MUTATE_EDIT_PROFILE_RESULT, result);
      await dispatch(SET_USER_CONFIG);
      setTimeout(() => commit(MUTATE_EDIT_PROFILE_RESULT, !result), 10000);
    } catch (e) {
      console.error(e)
      dispatch(REMOVE_NOTIFICATION, state.notifications.length - 1);
      dispatch(PUSH_NOTIFICATION, {
        status: 'error',
        message: parseError(e)
      });
    }
  },
  [FETCH_BALANCES]: async ({ commit, state }) => {
    const balances = state.address ? await userBalances(state.address) : 0;
    commit(MUTATE_BALANCES, balances);
  },
  [PUSH_NOTIFICATION]: async ({ commit, state }, notification) => {
    notification.time = Date.now() + notification.status;
    const notifications = [notification, ...state.notifications];
    commit(MUTATE_NOTIFICATIONS, notifications);
  },
  [REMOVE_NOTIFICATION]: async ({ commit, state }, index) => {
    const notifications = [
      ...state.notifications.slice(0, index),
      ...state.notifications.slice(index + 1)
    ];
    commit(MUTATE_NOTIFICATIONS, notifications);
  }
};
