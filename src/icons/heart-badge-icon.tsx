import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function HeartBadgeIcon({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.57 14.22A4.5 4.5 0 0 1 6.59 6.69A4.5 4.5 0 0 1 14.12 4.67A4.5 4.5 0 0 1 19.63 10.18A4.5 4.5 0 0 1 17.61 17.71A4.5 4.5 0 0 1 10.08 19.73A4.5 4.5 0 0 1 4.57 14.22Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M12.17 16.8C9.6 15.2 7.6 13.3 7.6 11.1C7.6 9.6 8.7 8.6 10 8.6C11 8.6 11.7 9.1 12.17 9.9C12.6 9.1 13.3 8.6 14.3 8.6C15.6 8.6 16.7 9.6 16.7 11.1C16.7 13.3 14.7 15.2 12.17 16.8Z"
        fill={color}
        stroke={color}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
