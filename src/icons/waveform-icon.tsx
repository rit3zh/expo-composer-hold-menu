import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function WaveformIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.8 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.25 9.75V14.25M9.75 4.75V19.25M14.25 6.75V16.25M18.75 9.9V14.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
