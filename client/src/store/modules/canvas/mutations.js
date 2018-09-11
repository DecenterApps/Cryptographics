import {
  MUTATE_CANVAS_DRAWING,
  MUTATE_SELECTED_ASSET_PACKS,
} from './types';

export default {
  [MUTATE_CANVAS_DRAWING]: (state, isCanvasDrawing) => {
    state.isCanvasDrawing = isCanvasDrawing;
  },
  [MUTATE_SELECTED_ASSET_PACKS]: (state, selectedAssetPacks) => {
    state.selectedAssetPacks = selectedAssetPacks;
  },
};



