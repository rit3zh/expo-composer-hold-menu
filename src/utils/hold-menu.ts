import { Extrapolation, interpolate } from 'react-native-reanimated';

import { COMPOSER_LAYOUT, COMPOSER_SHELF, HOLD_MENU_LAYOUT } from '../constants';

type TTrayMetrics = {
  size: number;
  startX: number;
  centerY: number;
};

export const getTrayMetrics = (
  count: number,
  windowWidth: number,
  anchorY: number
): TTrayMetrics => {
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

export const getTileCenterX = (index: number, tray: TTrayMetrics) => {
  'worklet';
  return tray.startX + tray.size / 2 + index * (tray.size + HOLD_MENU_LAYOUT.TILE_GAP);
};

export const findTileIndex = (x: number, y: number, count: number, tray: TTrayMetrics) => {
  'worklet';
  if (Math.abs(y - tray.centerY) > tray.size / 2 + HOLD_MENU_LAYOUT.HOVER_SLOP_Y) {
    return -1;
  }
  const halfSpan = (tray.size + HOLD_MENU_LAYOUT.TILE_GAP) / 2;
  for (let index = 0; index < count; index++) {
    if (Math.abs(x - getTileCenterX(index, tray)) <= halfSpan) {
      return index;
    }
  }
  return -1;
};

export const getSpreadPeak = (move: number) => {
  'worklet';
  const spread = Math.min(Math.max(move, 0), 1);
  return 4 * spread * (1 - spread);
};

export const getBlurMix = (depth: number, move: number, lift: number, isOpen: boolean) => {
  'worklet';
  const motion = depth * HOLD_MENU_LAYOUT.TRAIL_BLUR * getSpreadPeak(move);
  const closing = isOpen ? 0 : interpolate(lift, [0.1, 0.7], [1, 0], Extrapolation.CLAMP);
  return Math.max(motion, closing);
};

export const getDockTarget = (cardIndex: number, buttonX: number, buttonY: number) => {
  'worklet';
  const { ACTION_SIZE, BORDER_WIDTH, HEIGHT, PADDING } = COMPOSER_LAYOUT;
  const barLeft = buttonX - ACTION_SIZE / 2 - PADDING - BORDER_WIDTH;
  const rowTop = buttonY - HEIGHT / 2 + BORDER_WIDTH;
  const halfCard = COMPOSER_SHELF.CARD_SIZE / 2;
  return {
    x:
      barLeft +
      BORDER_WIDTH +
      COMPOSER_SHELF.EDGE_INSET +
      cardIndex * (COMPOSER_SHELF.CARD_SIZE + COMPOSER_SHELF.CARD_SPACING) +
      halfCard,
    y: rowTop - COMPOSER_SHELF.ROW_SPACING - halfCard,
  };
};
