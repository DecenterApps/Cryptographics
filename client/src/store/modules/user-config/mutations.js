import {
  MUTATE_ADDRESS,
  MUTATE_USERNAME,
  MUTATE_AVATAR,
  MUTATE_USERNAME_EXISTENCE,
  MUTATE_EDIT_PROFILE_RESULT,
  MUTATE_CREATED_ASSETS_PACKS_IDS,
  MUTATE_BOUGHT_ASSETS_PACKS_IDS,
  MUTATE_NETWORK,
  MUTATE_BALANCES,
  MUTATE_NOTIFICATIONS,
  MUTATE_APPROVAL,
  MUTATE_CONNECT_PROVIDER,
  MUTATE_CONNECT_PROVIDER_SUCCESS,
  MUTATE_LOGGING_IN,
} from './types';

export default {
  [MUTATE_CONNECT_PROVIDER]: (state, connecting) => {
    state.connectingProvider = connecting;
  },
  [MUTATE_LOGGING_IN]: (state, payload) => {
    state.loggingIn = payload.loggingIn;
    state.loggingInAccountType = payload.accountType;
  },
  [MUTATE_CONNECT_PROVIDER_SUCCESS]: (state, payload) => {
    state.connectingProvider = false;
    state.network = payload.network;
    state.address = payload.address;
    state.accountType = payload.accountType;
  },
  [MUTATE_NETWORK]: (state, network) => {
    state.network = network;
  },
  [MUTATE_ADDRESS]: (state, address) => {
    state.address = address;
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
  },
  [MUTATE_BALANCES]: (state, balances) => {
    state.balances = balances;
  },
  [MUTATE_NOTIFICATIONS]: (state, notifications) => {
    state.notifications = notifications;
  },
  [MUTATE_APPROVAL]: (state, metamaskApproved) => {
    state.metamaskApproved = metamaskApproved;
  }
};



