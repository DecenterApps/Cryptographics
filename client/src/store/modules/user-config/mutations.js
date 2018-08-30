import {
  MUTATE_METAMASK_ADDRESS,
  MUTATE_USERNAME,
  MUTATE_AVATAR,
  MUTATE_USERNAME_EXISTENCE,
  MUTATE_EDIT_PROFILE_RESULT,
  MUTATE_CREATED_ASSETS_PACKS_IDS,
  MUTATE_BOUGHT_ASSETS_PACKS_IDS,
  MUTATE_NETWORK,
} from './types';

export default {
  [MUTATE_NETWORK]: (state, network) => {
    state.network = network;
  },
  [MUTATE_METAMASK_ADDRESS]: (state, metamaskAddress) => {
    state.metamaskAddress = metamaskAddress;
  },
  [MUTATE_USERNAME]: (state, username) => {
    state.username = username;
  },
  [MUTATE_AVATAR]: (state, avatar) => {
    state.avatar = avatar;
  },
  [MUTATE_USERNAME_EXISTENCE]: (state, isExisting) => {
    state.changeUsername.isExisting = isExisting;
  },
  [MUTATE_EDIT_PROFILE_RESULT]: (state, result) => {
    state.changeUsername.result = result;
  },
  [MUTATE_CREATED_ASSETS_PACKS_IDS]: (state, createdIDs) => {
    state.assets.createdIDs = createdIDs;
  },
  [MUTATE_BOUGHT_ASSETS_PACKS_IDS]: (state, boughtIDs) => {
    state.assets.boughtIDs = boughtIDs;
  }
};



