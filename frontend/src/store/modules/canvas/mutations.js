import {
  MUTATE_CANVAS_DRAWING,
} from './types';

export default {
  [MUTATE_CANVAS_DRAWING]: (state, isCanvasDrawing) => {
    state.isCanvasDrawing = isCanvasDrawing;
  },
};



