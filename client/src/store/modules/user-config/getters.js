import {
  METAMASK_ADDRESS,
  USERNAME,
  AVATAR,
  USERNAME_EXISTENCE,
  EDIT_PROFILE_RESULT,
  CREATED_ASSETS_PACKS_IDS,
  BOUGHT_ASSETS_PACKS_IDS,
  NETWORK,
  BALANCES,
  BANNED_ASSET_PACK_IDS,
  BANNED_CRYPTOGRAPHIC_IDS,
  NOTIFICATIONS,
  METAMASK_APPROVED
} from './types';

export default {
  [NETWORK]: state => {
    return state.network;
  },
  [METAMASK_ADDRESS]: state => {
    return state.metamaskAddress;
  },
  [USERNAME]: state => {
    return state.username;
  },
  [AVATAR]: state => {
    return state.avatar;
  },
  [USERNAME_EXISTENCE]: state => {
    return state.changeUsername.isExisting;
  },
  [EDIT_PROFILE_RESULT]: state => {
    return state.changeUsername.result;
  },
  [CREATED_ASSETS_PACKS_IDS]: state => {
    return state.assets.createdIDs;
  },
  [BOUGHT_ASSETS_PACKS_IDS]: state => {
    return state.assets.boughtIDs;
  },
  [BALANCES]: state => {
    return state.balances;
  },
  [BANNED_ASSET_PACK_IDS]: state => {
    return state.bannedIDs.assetPacks;
  },
  [BANNED_CRYPTOGRAPHIC_IDS]: state => {
    return state.bannedIDs.cryptographics;
  },
  [NOTIFICATIONS]: state => {
    return state.notifications;
  },
  [METAMASK_APPROVED]: state => {
    return state.metamaskApproved;
  }
};