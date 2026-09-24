import { Easing } from 'react-native-reanimated';

const COMPOSER_SHELF = {
  MAX_CARDS: 2,
  CARD_SIZE: 112,
  CARD_RADIUS: 18,
  CARD_SPACING: 10,
  EDGE_INSET: 9,
  ROW_SPACING: 2,
  BADGE_SIZE: 24,
  BADGE_OFFSET: 7,
  BADGE_ICON_SIZE: 16,
} as const;
const SHELF_OPEN_HEIGHT =
  COMPOSER_SHELF.EDGE_INSET + COMPOSER_SHELF.CARD_SIZE + COMPOSER_SHELF.ROW_SPACING;
const COMPOSER_MOTION = {
  SHELF_REVEAL: { duration: 320, dampingRatio: 1 },
  DOCK: { duration: 440, easing: Easing.bezier(0.22, 1, 0.36, 1) },
  BADGE_REVEAL: { duration: 220, easing: Easing.out(Easing.cubic) },
  FOCUS: { duration: 380, dampingRatio: 1 },
  CARD_EXIT: { duration: 280, easing: Easing.bezier(0.4, 0, 0.2, 1) },
  CARD_EXIT_SCALE: 0.6,
  SHELF_COLLAPSE_DELAY: 90,
  CARD_REFLOW_DURATION: 260,
} as const;
export { COMPOSER_MOTION, COMPOSER_SHELF, SHELF_OPEN_HEIGHT };
