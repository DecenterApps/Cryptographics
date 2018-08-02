import {
  CANVAS_DRAWING,
} from './types';

export default {
  [CANVAS_DRAWING]: state => {
    return state.isCanvasDrawing;
  },
};