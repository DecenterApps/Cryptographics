import {
  MUTATE_MODAL,
  MUTATE_CONTENT,
  MUTATE_LOADING_MODAL,
  MUTATE_LOADING_CONTENT,
} from './types';

export default {
  [MUTATE_MODAL]: (state, showModal) => {
    state.showModal = showModal;
  },
  [MUTATE_CONTENT]: (state, content) => {
    state.content = content;
  },
  [MUTATE_LOADING_MODAL]: (state, showLoadingModal) => {
    state.showLoadingModal = showLoadingModal;
  },
  [MUTATE_LOADING_CONTENT]: (state, loadingContent) => {
    state.loadingContent = loadingContent;
  },
};



