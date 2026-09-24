import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function PencilIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.8 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.6 13.4L14.05 5.2A3.2 3.2 0 0 1 18.55 9.7L10 18L3.9 19.65ZM13.1 6.1L17.6 10.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
