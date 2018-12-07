import { DEFAULT_AVATAR, DEFAULT_USERNAME } from 'config/constants';

export default {
  username: DEFAULT_USERNAME,
  network: undefined,
  metamaskAddress: undefined,
  metamaskApproved: undefined,
  avatar: DEFAULT_AVATAR,
  changeUsername: {
    isExisting: undefined,
    result: undefined
  },
  bannedIDs: {
    assetPacks: [25, 65, 74],
    cryptographics: [],
  },
  assets: {
    createdIDs: [],
    boughtIDs: [],
  },
  graphics: {
    createdIDs: [],
    boughtIDs: [],
  },
  balances: {
    assetsBalance: 0,
    marketplaceBalance: 0,
  },
  notifications: []
};