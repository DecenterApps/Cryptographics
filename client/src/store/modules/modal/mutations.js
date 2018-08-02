import {
    MUTATE_MODAL,
    MUTATE_CONTENT
} from './types';

export default {
    [MUTATE_MODAL]: (state, showModal) => {
        state.showModal = showModal;
    },
    [MUTATE_CONTENT]: (state, content) => {
        state.content = content;
    },
};



