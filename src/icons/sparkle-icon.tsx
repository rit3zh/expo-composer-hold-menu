import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

export function SparkleIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.8 }: TIcon) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.54C13.44 8.1 15.9 10.56 22.46 12C15.9 13.44 13.44 15.9 12 22.46C10.56 15.9 8.1 13.44 1.54 12C8.1 10.56 10.56 8.1 12 1.54Z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
