import Svg, { Circle, Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function SearchIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2.1 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={10.8} cy={10.8} r={7.7} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M16.4 16.4L20.6 20.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
