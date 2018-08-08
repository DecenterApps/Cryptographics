import {
    METAMASK_ADDRESS,
    USERNAME,
    AVATAR,
    USERNAME_EXISTENCE,
    EDIT_PROFILE_RESULT,
    CREATED_ASSETS_PACKS_IDS,
    BOUGHT_ASSETS_PACKS_IDS
} from './types';

export default {
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
    }
};