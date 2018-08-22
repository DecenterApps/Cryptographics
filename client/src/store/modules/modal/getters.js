import {
  MODAL,
  CONTENT,
  LOADING_MODAL,
} from './types';

export default {
  [MODAL]: state => {
    return state.showModal;
  },
  [LOADING_MODAL]: state => {
    return state.showLoadingModal;
  },
  [CONTENT]: state => {
    return state.content;
  }
};