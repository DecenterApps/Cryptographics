import {
    METAMASK_ADDRESS,
    USERNAME,
    AVATAR,
    USERNAME_EXISTENCE,
    EDIT_PROFILE_RESULT
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
    }
};