import {
    METAMASK_ADDRESS,
    USERNAME
} from './types';

export default {
    [METAMASK_ADDRESS]: state => {
        return state.metamaskAddress;
    },
    [USERNAME]: state => {
        return state.username;
    }
};