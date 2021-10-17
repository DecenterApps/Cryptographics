import { DEFAULT_AVATAR, DEFAULT_USERNAME } from 'config/constants';

export const LS_ACCOUNT_TYPE = 'CG_LS__jcq0k0129a912ndc9iocmaklq';

const lsAccountType = localStorage.getItem(LS_ACCOUNT_TYPE);

export default {
  username: DEFAULT_USERNAME,
  network: undefined,
  address: undefined,
  avatar: DEFAULT_AVATAR,
  accountType: lsAccountType || undefined,
  connectingProvider: undefined,
  loggingIn: undefined,
  loggingInAccountType: undefined,
  metamaskApproved: undefined,
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
