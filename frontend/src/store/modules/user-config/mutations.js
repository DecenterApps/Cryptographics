import {
    MUTATE_METAMASK_ACC
} from './types';

export default {
    [MUTATE_METAMASK_ACC]: (state, payload) => {
        state.metamaskAcc = payload;
    }
};



