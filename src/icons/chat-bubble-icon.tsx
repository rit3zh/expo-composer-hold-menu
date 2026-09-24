import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function ChatBubbleIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.51 16.65L4.7 19.6L7.42 18.37A8.5 7.9 0 1 0 5.51 16.65Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
