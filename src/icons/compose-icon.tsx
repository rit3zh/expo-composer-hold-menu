import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function ComposeIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.6 4H7.6A4 4 0 0 0 3.6 8V16.3A4 4 0 0 0 7.6 20.3H16.3A4 4 0 0 0 20.3 16.3V13.4M16.9 4.3A2 2 0 0 1 19.7 7.1L11.7 15.1H8.4V12.8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
