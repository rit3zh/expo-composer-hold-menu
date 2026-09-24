import { COMPOSER_LAYOUT, COMPOSER_SHELF } from '../constants';
import { BORDER_WIDTH } from '../constants/layout.constants';

interface IDockTarget {
  x: number;
  y: number;
}

const getDockTarget = (cardIndex: number, buttonX: number, buttonY: number): IDockTarget => {
  'worklet';
  const barLeft =
    buttonX - COMPOSER_LAYOUT.ACTION_SIZE / 2 - COMPOSER_LAYOUT.PADDING - BORDER_WIDTH;
  const rowTop = buttonY - COMPOSER_LAYOUT.HEIGHT / 2 + BORDER_WIDTH;
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

export { getDockTarget };
