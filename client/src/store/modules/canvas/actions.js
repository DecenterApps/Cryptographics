import {
  START_CANVAS_DRAWING,
  FINISH_CANVAS_DRAWING,
  MUTATE_CANVAS_DRAWING,
  TOGGLE_ASSET_PACK,
  MUTATE_SELECTED_ASSET_PACKS,
  SELECT_SINGLE_ASSET_PACK,
} from './types';
import { preloadAssets } from '../../../services/helpers';

export default {
  [START_CANVAS_DRAWING]: ({ commit, state }, content) => {
    commit(MUTATE_CANVAS_DRAWING, true);
  },
  [FINISH_CANVAS_DRAWING]: ({ commit, state }, content) => {
    commit(MUTATE_CANVAS_DRAWING, false);
  },
  [TOGGLE_ASSET_PACK]: ({ commit, state }, assetPack) => {
    const index = state.selectedAssetPacks.findIndex(item => item.id.toString() === assetPack.id.toString());
    if (index >= 0) {
      return commit(MUTATE_SELECTED_ASSET_PACKS, [
        ...state.selectedAssetPacks.slice(0, index),
        ...state.selectedAssetPacks.slice(index + 1),
      ]);
    }
    preloadAssets(assetPack);
    commit(MUTATE_SELECTED_ASSET_PACKS, [...state.selectedAssetPacks, assetPack]);
  },
  [SELECT_SINGLE_ASSET_PACK]: ({ commit, state }, assetPack) => {
    commit(MUTATE_SELECTED_ASSET_PACKS, [assetPack]);
  },
};