import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';

import type { TIcon } from '../types';

export function EnvelopeIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.4 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <Mask id="envelope-folds">
          <Rect width={24} height={24} fill="white" />
          <Path
            d="M3 5.9L12 12.9L21 5.9M2.8 19L9.7 11.9M21.2 19L14.3 11.9"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Mask>
      </Defs>
      <Rect
        x={2}
        y={4.5}
        width={20}
        height={15}
        rx={2.2}
        fill={color}
        mask="url(#envelope-folds)"
      />
    </Svg>
  );
}
