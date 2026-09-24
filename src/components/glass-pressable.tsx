import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import type { TPalette } from '../constants';
import { useThemedStyles } from '../hooks';
import { isGlassSupported } from '../utils';
import { GlassSurface, type TGlassSurface } from './glass-surface';

export type TGlassPressable = TGlassSurface &
  Pick<
    PressableProps,
    | 'onPress'
    | 'onPressIn'
    | 'onPressOut'
    | 'onLongPress'
    | 'disabled'
    | 'hitSlop'
    | 'accessibilityRole'
    | 'accessibilityLabel'
    | 'accessibilityHint'
    | 'testID'
  >;

export function GlassPressable({
  children,
  style,
  fallbackStyle,
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive = true,
  ...pressableProps
}: TGlassPressable) {
  const styles = useThemedStyles(createStyles);
  const showsPressFeedback = !isGlassSupported || glassEffectStyle === 'none';
  const borderRadius = StyleSheet.flatten(style)?.borderRadius;

  return (
    <GlassSurface
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      isInteractive={isInteractive}
      style={style}
      fallbackStyle={fallbackStyle}>
      {children}
      <Pressable
        {...pressableProps}
        style={({ pressed }) => [
          StyleSheet.absoluteFill,
          { borderRadius },
          showsPressFeedback && pressed && styles.pressed,
        ]}
      />
    </GlassSurface>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    pressed: {
      backgroundColor: palette.glassPressed,
    },
  });
