import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { TIcon } from '../types';

export function ShapesIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.5}
        y={3.6}
        width={6.8}
        height={6.8}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M18.67 3.65L20.65 5.63A1.8 1.8 0 0 1 20.65 8.17L18.67 10.15A1.8 1.8 0 0 1 16.13 10.15L14.15 8.17A1.8 1.8 0 0 1 14.15 5.63L16.13 3.65A1.8 1.8 0 0 1 18.67 3.65Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx={6.9} cy={17.4} r={3.5} stroke={color} strokeWidth={strokeWidth} />
      <Rect
        x={14}
        y={14}
        width={6.8}
        height={6.8}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
