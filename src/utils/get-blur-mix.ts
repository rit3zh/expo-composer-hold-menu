import { Extrapolation, interpolate } from 'react-native-reanimated';

import { HOLD_MENU_LAYOUT } from '../constants';
import { getSpreadPeak } from './get-spread-peak';

const getBlurMix = <T extends number>(depth: T, move: T, lift: T, isOpen: boolean): T => {
  'worklet';
  const motion = depth * HOLD_MENU_LAYOUT.TRAIL_BLUR * getSpreadPeak<number>(move);
  const closing = isOpen ? 0 : interpolate(lift, [0.1, 0.7], [1, 0], Extrapolation.CLAMP);
  return Math.max(motion, closing) as T satisfies number;
};

export { getBlurMix };
