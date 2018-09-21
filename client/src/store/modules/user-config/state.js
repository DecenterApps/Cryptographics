import { DEFAULT_AVATAR_IPFS_HASH, DEFAULT_USERNAME } from 'config/constants';

export default {
  username: DEFAULT_USERNAME,
  network: undefined,
  metamaskAddress: undefined,
  avatar: DEFAULT_AVATAR_IPFS_HASH,
  changeUsername: {
    isExisting: undefined,
    result: undefined
  },
  assets: {
    createdIDs: [],
    boughtIDs: []
  },
  graphics: {
    createdIDs: [],
    boughtIDs: []
  }
};