import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { TIcon } from '../types';

export function ImageIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.8 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.75}
        y={4.75}
        width={15.9}
        height={14.5}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Circle cx={13.3} cy={9.9} r={2.05} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M3.75 15.25L5.88 13.12Q7.58 11.42 9.28 13.11L15.42 19.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
