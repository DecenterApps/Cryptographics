import { DEFAULT_AVATAR, DEFAULT_USERNAME } from 'config/constants';

export default {
  username: DEFAULT_USERNAME,
  network: undefined,
  metamaskAddress: undefined,
  avatar: DEFAULT_AVATAR,
  changeUsername: {
    isExisting: undefined,
    result: undefined
  },
  assets: {
    createdIDs: [],
    boughtIDs: [],
    bannedIDs: [],
  },
  graphics: {
    createdIDs: [],
    boughtIDs: [],
    bannedIDs: [],
  },
  balances: {
    assetsBalance: 0,
    marketplaceBalance: 0,
  }
};