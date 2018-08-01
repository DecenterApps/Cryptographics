import {
    TOGGLE_MODAL,
    MUTATE_MODAL,
    MUTATE_CONTENT
} from './types';

export default {
    [TOGGLE_MODAL]: ({ commit, state }, content) => {
        commit(MUTATE_CONTENT, content)
        commit(MUTATE_MODAL, !state.showModal)
    }
};