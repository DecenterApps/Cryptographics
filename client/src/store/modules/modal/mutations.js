import {
  MUTATE_MODAL,
  MUTATE_CONTENT,
  MUTATE_LOADING_MODAL,
} from './types';

export default {
  [MUTATE_MODAL]: (state, showModal) => {
    state.showModal = showModal;
  },
  [MUTATE_LOADING_MODAL]: (state, showLoadingModal) => {
    state.showLoadingModal = showLoadingModal;
  },
  [MUTATE_CONTENT]: (state, content) => {
    state.content = content;
  },
};



