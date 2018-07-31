import {
    SET_USER_CONFIG,
    UPDATE_USER_CONFIG,
    SET_METAMASK_ADDRESS,
    SET_USERNAME,
    EDIT_USERNAME,
    MUTATE_METAMASK_ADDRESS,
    MUTATE_USERNAME
} from './types';

import { getAccounts } from 'scripts/helpers';
import { getUsername, usernameExists, registerUser } from 'services/ethereumService';

export default {
    [SET_METAMASK_ADDRESS]: async ({ commit }) => {
        let metamaskAddress = await getAccounts();
        commit(MUTATE_METAMASK_ADDRESS, metamaskAddress);
    },
    [SET_USERNAME]: async ({ commit, state }) => {
        let username = await getUsername(state.metamaskAddress);
        if (username !== '') {
            commit(MUTATE_USERNAME, username);
        } else {
            let username = 'Anon';
            commit(MUTATE_USERNAME, username);
        }
    },
    [SET_USER_CONFIG]: async ({ dispatch }) => {
        await dispatch(SET_METAMASK_ADDRESS);
        await dispatch(SET_USERNAME);
    },
    [UPDATE_USER_CONFIG]: async ({ dispatch, state }) => {
        setInterval(async function() {
            let changedMetamaskAddress = await getAccounts();
            if (changedMetamaskAddress !== state.metamaskAddress) {
                dispatch(SET_USER_CONFIG);
            }
        }, 1000)
        return true;
    },
    [EDIT_USERNAME]: async ({ dispatch }, newUsername) => {
        let isExisting = await usernameExists(newUsername);
        if (!isExisting) {
            await registerUser(newUsername, "0x0");
            await dispatch(SET_USERNAME);
        }
    }
};