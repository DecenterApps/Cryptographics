import {
    MUTATE_METAMASK_ADDRESS,
    MUTATE_USERNAME
} from './types';

export default {
    [MUTATE_METAMASK_ADDRESS]: (state, metamaskAddress) => {
        state.metamaskAddress = metamaskAddress;
    },
    [MUTATE_USERNAME]: (state, username) => {
        state.username = username;
    }
};



