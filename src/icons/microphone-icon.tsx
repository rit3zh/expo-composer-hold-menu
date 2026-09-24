import Svg, { Path, Rect } from 'react-native-svg';

import type { TIcon } from '../types';

export function MicrophoneIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={8}
        y={2.35}
        width={8}
        height={12.65}
        rx={4}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4.5 13.9A8.125 8.125 0 0 0 19.5 13.9M12 18.9V22.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
