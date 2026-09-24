import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function DashedChatIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2.25 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.58 5.26A10.5 10 0 0 1 19.42 5.26M22.09 9.57A10.5 10 0 0 1 14 22.15M1.91 9.57A10.5 10 0 0 0 3.17 17.75L2.75 21.7Q6 19.8 9.67 22.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
