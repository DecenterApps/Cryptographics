import {
  SET_METAMASK_ADDRESS,
  SET_USERNAME,
  SET_AVATAR,
  SET_USER_CONFIG,
  SET_CREATED_ASSETS_PACKS_IDS,
  SET_BOUGHT_ASSETS_PACKS_IDS,
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
  SET_NEW_USERNAME,
  SET_NETWORK, MUTATE_NETWORK,
} from './types';

import {
  TOGGLE_MODAL
} from '../modal/types';

import { getAccounts, getNetwork } from 'services/helpers';
import * as utils from 'services/utils';
import {
  getUsername,
  getAvatar,
  usernameExists,
  registerUser,
  getCreatedAssetPacks,
  getBoughtAssetPacks
} from 'services/ethereumService';

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
      let username = 'Anon';
      commit(MUTATE_USERNAME, username);
    }
  },
  [SET_AVATAR]: async ({ commit, state }) => {
    let avatarBytes32 = await getAvatar(state.metamaskAddress);
    const initialAvatarBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (avatarBytes32 !== initialAvatarBytes32) {
      let avatar = utils.getIpfsHashFromBytes32(avatarBytes32);
      commit(MUTATE_AVATAR, avatar);
    } else {
      let avatar = 'QmP8A71rFcz7Y4JUG2tJzYjxsKycxKVu6thY8E7HbrFNkG';
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
  [SET_USER_CONFIG]: async ({ dispatch }) => {
    await dispatch(SET_METAMASK_ADDRESS);
    dispatch(SET_NETWORK);
    dispatch(SET_USERNAME);
    dispatch(SET_AVATAR);
    dispatch(SET_CREATED_ASSETS_PACKS_IDS);
    dispatch(SET_BOUGHT_ASSETS_PACKS_IDS);
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
    await dispatch(CHECK_USERNAME_EXISTENCE, newUsername);
    if (!state.changeUsername.isExisting) {
      if (newUsername === '') {
        newUsername = state.username;
      }
      if (newAvatarBytes32 === '') {
        const initialAvatarBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
        newAvatarBytes32 = initialAvatarBytes32;
      }
      await registerUser(newUsername, newAvatarBytes32, state.metamaskAddress);
      let result = true;
      commit(MUTATE_EDIT_PROFILE_RESULT, result);
      await dispatch(SET_USER_CONFIG);
      setTimeout(() => commit(MUTATE_EDIT_PROFILE_RESULT, !result), 10000);
    } else {
      let result = false;
      commit(MUTATE_EDIT_PROFILE_RESULT, result);
    }
  }
};