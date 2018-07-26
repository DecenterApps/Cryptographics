import {
    UPDATE_METAMASK_ACC,
    MUTATE_METAMASK_ACC
} from './types';

import { getAccounts } from 'helpers';

export default {
    [UPDATE_METAMASK_ACC]: async ({ commit }) => {
        const acc = await getAccounts();
        commit(MUTATE_METAMASK_ACC, acc);
        return true;
    }
};