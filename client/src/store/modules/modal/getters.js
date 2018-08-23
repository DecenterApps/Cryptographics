import {
  MODAL,
  CONTENT,
  LOADING_MODAL,
  LOADING_CONTENT,
} from './types';

export default {
  [MODAL]: state => {
    return state.showModal;
  },
  [CONTENT]: state => {
    return state.content;
  },
  [LOADING_MODAL]: state => {
    return state.showLoadingModal;
  },
  [LOADING_CONTENT]: state => {
    return state.loadingContent;
  }
};