import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function FolderIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.7 11.3H20.5M3.7 7.2A2.5 2.5 0 0 1 6.2 4.7H8.9C9.9 4.7 10.3 6.3 11.6 6.3H18A2.5 2.5 0 0 1 20.5 8.8V17.2A2.5 2.5 0 0 1 18 19.7H6.2A2.5 2.5 0 0 1 3.7 17.2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
