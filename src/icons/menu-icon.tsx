import Animated, {
  useAnimatedProps,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import type { TIcon } from '../types';

type TBarPose = {
  x: number;
  y: number;
  halfLength: number;
  angle: number;
};

const TOP_BAR: Record<'menu' | 'close', TBarPose> = {
  menu: { x: 11.7, y: 7.3, halfLength: 9.7, angle: 0 },
  close: { x: 12, y: 12, halfLength: 8.5, angle: Math.PI / 4 },
};

const BOTTOM_BAR: Record<'menu' | 'close', TBarPose> = {
  menu: { x: 8, y: 17.4, halfLength: 6, angle: 0 },
  close: { x: 12, y: 12, halfLength: 8.5, angle: -Math.PI / 4 },
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const getBarPath = (from: TBarPose, to: TBarPose, t: number) => {
  'worklet';
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const halfLength = from.halfLength + (to.halfLength - from.halfLength) * t;
  const angle = from.angle + (to.angle - from.angle) * t;
  const dx = Math.cos(angle) * halfLength;
  const dy = Math.sin(angle) * halfLength;
  return `M${x - dx} ${y - dy}L${x + dx} ${y + dy}`;
};

type TMenuIcon = TIcon & {
  progress?: SharedValue<number>;
};

export function MenuIcon({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2.25,
  progress,
}: TMenuIcon) {
  const idleProgress = useSharedValue(0);
  const morphProgress = progress ?? idleProgress;

  const animatedProps = useAnimatedProps(() => {
    const t = Math.min(Math.max(morphProgress.get(), 0), 1);
    return {
      d:
        getBarPath(TOP_BAR.menu, TOP_BAR.close, t) +
        getBarPath(BOTTOM_BAR.menu, BOTTOM_BAR.close, t),
    };
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
