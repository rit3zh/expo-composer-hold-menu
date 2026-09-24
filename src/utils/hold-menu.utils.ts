import { COMPOSER_LAYOUT, HOLD_MENU_LAYOUT } from '../constants';
import type { ITrayMetrics } from '../interfaces';

const getTrayMetrics = (count: number, windowWidth: number, anchorY: number): ITrayMetrics => {
  'worklet';
  const gaps = HOLD_MENU_LAYOUT.TILE_GAP * (count - 1);
  const available = windowWidth - HOLD_MENU_LAYOUT.TRAY_INSET * 2 - gaps;
  const size = Math.min(available / count, HOLD_MENU_LAYOUT.MAX_TILE_SIZE);
  const rowWidth = size * count + gaps;
  return {
    size,
    startX: (windowWidth - rowWidth) / 2,
    centerY: anchorY - COMPOSER_LAYOUT.HEIGHT / 2 - HOLD_MENU_LAYOUT.TRAY_OFFSET - size / 2,
  };
};

const getTileCenterX = (index: number, metrics: ITrayMetrics): number => {
  'worklet';
  return metrics.startX + metrics.size / 2 + index * (metrics.size + HOLD_MENU_LAYOUT.TILE_GAP);
};

const findTileIndex = (x: number, y: number, count: number, metrics: ITrayMetrics): number => {
  'worklet';
  if (Math.abs(y - metrics.centerY) > metrics.size / 2 + HOLD_MENU_LAYOUT.HOVER_SLOP_Y) {
    return -1;
  }
  const halfSpan = (metrics.size + HOLD_MENU_LAYOUT.TILE_GAP) / 2;
  for (let index = 0; index < count; index++) {
    if (Math.abs(x - getTileCenterX(index, metrics)) <= halfSpan) {
      return index;
    }
  }
  return -1;
};

export { findTileIndex, getTileCenterX, getTrayMetrics };
