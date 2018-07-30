import {
    MODAL,
    CONTENT
} from './types';

export default {
    [MODAL]: state => {
        return state.showModal;
    },
    [CONTENT]: state => {
        return state.content;
    }
};