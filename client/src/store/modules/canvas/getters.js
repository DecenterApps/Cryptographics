import {
  CANVAS_DRAWING, SELECTED_ASSET_PACKS,
} from './types';

export default {
  [CANVAS_DRAWING]: state => {
    return state.isCanvasDrawing;
  },
  [SELECTED_ASSET_PACKS]: state => {
    return state.selectedAssetPacks;
  },
};