import {
  TOGGLE_MODAL,
  MUTATE_MODAL,
  MUTATE_CONTENT,
  MUTATE_LOADING_MODAL,
  TOGGLE_LOADING_MODAL,
} from './types';

export default {
  [TOGGLE_MODAL]: ({ commit, state }, content) => {
    commit(MUTATE_CONTENT, content);
    commit(MUTATE_MODAL, !state.showModal);
  },
  [TOGGLE_LOADING_MODAL]: ({ commit, state }, content) => {
    commit(MUTATE_LOADING_MODAL, !state.showLoadingModal);
  }
};