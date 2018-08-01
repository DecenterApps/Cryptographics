import {
    MUTATE_METAMASK_ADDRESS,
    MUTATE_USERNAME,
    MUTATE_USERNAME_EXISTENCE,
    MUTATE_EDIT_PROFILE_RESULT
} from './types';

export default {
    [MUTATE_METAMASK_ADDRESS]: (state, metamaskAddress) => {
        state.metamaskAddress = metamaskAddress;
    },
    [MUTATE_USERNAME]: (state, username) => {
        state.username = username;
    },
    [MUTATE_USERNAME_EXISTENCE]: (state, isExisting) => {
        state.changeUsername.isExisting = isExisting;
    },
    [MUTATE_EDIT_PROFILE_RESULT]: (state, result) => {
        state.changeUsername.result = result;
    }
};



