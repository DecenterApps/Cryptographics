import { getLandingPacks } from '../../../services/ethereumService';

export default {
  isCanvasDrawing: false,
  selectedAssetPacks: getLandingPacks().packs,
};