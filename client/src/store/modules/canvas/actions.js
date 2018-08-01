import {
  TOGGLE_CANVAS_DRAWING,
  MUTATE_CANVAS_DRAWING
} from './types';

export default {
  [TOGGLE_CANVAS_DRAWING]: ({ commit, state }, content) => {
    commit(MUTATE_CANVAS_DRAWING, !state.isCanvasDrawing);
  }
};