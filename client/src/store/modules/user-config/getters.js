import {
    METAMASK_ADDRESS,
    USERNAME,
    USERNAME_EXISTENCE,
    CHANGE_USERNAME_RESULT
} from './types';

export default {
    [METAMASK_ADDRESS]: state => {
        return state.metamaskAddress;
    },
    [USERNAME]: state => {
        return state.username;
    },
    [USERNAME_EXISTENCE]: state => {
        return state.changeUsername.isExisting;
    },
    [CHANGE_USERNAME_RESULT]: state => {
        return state.changeUsername.result;
    }
};