import {
  TOGGLE_MODAL,
  MUTATE_MODAL,
  MUTATE_CONTENT,
  MUTATE_LOADING_MODAL,
  TOGGLE_LOADING_MODAL,
  MUTATE_LOADING_CONTENT,
  CHANGE_LOADING_CONTENT,
  HIDE_LOADING_MODAL,
  SHOW_LOADING_MODAL,
} from './types';

export default {
  [TOGGLE_MODAL]: ({ commit, state }, content) => {
    commit(MUTATE_CONTENT, content);
    commit(MUTATE_MODAL, !state.showModal);
  },
  [TOGGLE_LOADING_MODAL]: ({ commit, state }, loadingContent) => {
    commit(MUTATE_LOADING_CONTENT, loadingContent);
    commit(MUTATE_LOADING_MODAL, !state.showLoadingModal);
  },
  [HIDE_LOADING_MODAL]: ({ commit, state }) => {
    commit(MUTATE_LOADING_MODAL, false);
  },
  [SHOW_LOADING_MODAL]: ({ commit, state }, loadingContent) => {
    commit(MUTATE_LOADING_CONTENT, loadingContent);
    commit(MUTATE_LOADING_MODAL, true);
  },
  [CHANGE_LOADING_CONTENT]: ({ commit, state }, loadingContent) => {
    commit(MUTATE_LOADING_CONTENT, loadingContent);
  }
};