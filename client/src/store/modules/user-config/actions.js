import {
  SET_METAMASK_ADDRESS,
  SET_USERNAME,
  SET_AVATAR,
  SET_USER_CONFIG,
  SET_CREATED_ASSETS_PACKS_IDS,
  SET_BOUGHT_ASSETS_PACKS_IDS,
  SET_APPROVAL,
  UPDATE_USER_CONFIG,
  CHECK_USERNAME_EXISTENCE,
  EDIT_PROFILE,
  MUTATE_METAMASK_ADDRESS,
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
  PUSH_NOTIFICATION, MUTATE_NOTIFICATIONS, REMOVE_NOTIFICATION,
} from './types';
import { TOGGLE_MODAL, TOGGLE_LOADING_MODAL, HIDE_LOADING_MODAL, CHANGE_LOADING_CONTENT } from '../modal/types';
import { DEFAULT_AVATAR, DEFAULT_USERNAME, ipfsNodePath } from 'config/constants';

import { getAccounts, getNetwork, parseError, isMetamaskApproved } from 'services/helpers';
import * as utils from 'services/utils';
import {
  getUsername,
  getAvatar,
  usernameExists,
  registerUser,
  getCreatedAssetPacks,
  getBoughtAssetPacks,
  userBalances,
} from 'services/ethereumService';
import { metamaskApprove } from '../../../services/helpers';

export default {
  [SET_NETWORK]: async ({ commit }) => {
    const network = await getNetwork();
    commit(MUTATE_NETWORK, network);
  },
  [SET_METAMASK_ADDRESS]: async ({ commit }) => {
    const metamaskAddress = await getAccounts();
    commit(MUTATE_METAMASK_ADDRESS, metamaskAddress);
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
    let username = await getUsername(state.metamaskAddress);
    if (username !== '') {
      commit(MUTATE_USERNAME, username);
    } else {
      let username = DEFAULT_USERNAME;
      commit(MUTATE_USERNAME, username);
    }
  },
  [SET_AVATAR]: async ({ commit, state }) => {
    let avatarBytes32 = await getAvatar(state.metamaskAddress);
    const initialAvatarBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (avatarBytes32 !== initialAvatarBytes32) {
      let avatar = ipfsNodePath + utils.getIpfsHashFromBytes32(avatarBytes32);
      commit(MUTATE_AVATAR, avatar);
    } else {
      let avatar = DEFAULT_AVATAR;
      commit(MUTATE_AVATAR, avatar);
    }
  },
  [SET_CREATED_ASSETS_PACKS_IDS]: async ({ commit, state }) => {
    let createdIDs = await getCreatedAssetPacks(state.metamaskAddress);
    commit(MUTATE_CREATED_ASSETS_PACKS_IDS, createdIDs.reverse());
  },
  [SET_BOUGHT_ASSETS_PACKS_IDS]: async ({ commit, state }) => {
    let boughtIDs = await getBoughtAssetPacks(state.metamaskAddress);
    commit(MUTATE_BOUGHT_ASSETS_PACKS_IDS, boughtIDs.reverse());
  },
  [SET_APPROVAL]: async ({ commit }) => {
    const metamaskApproved = await isMetamaskApproved();
    commit(MUTATE_APPROVAL, metamaskApproved);
  },
  [SET_USER_CONFIG]: async ({ dispatch }) => {
    await dispatch(SET_METAMASK_ADDRESS);
    dispatch(SET_NETWORK);
    dispatch(SET_USERNAME);
    dispatch(SET_AVATAR);
    dispatch(SET_CREATED_ASSETS_PACKS_IDS);
    dispatch(SET_BOUGHT_ASSETS_PACKS_IDS);
    dispatch(SET_APPROVAL);
  },
  [UPDATE_USER_CONFIG]: async ({ dispatch, state }) => {
    setInterval(async function () {
      let changedMetamaskAddress = await getAccounts();
      if (changedMetamaskAddress !== state.metamaskAddress) {
        dispatch(SET_USER_CONFIG);
      }
    }, 1000);
    return true;
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
            newAvatarBytes32 = await getAvatar(state.metamaskAddress);
          }
        }
      }
      const transactionPromise = await registerUser(newUsername, newAvatarBytes32, state.metamaskAddress);
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
    const balances = await userBalances(state.metamaskAddress);
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