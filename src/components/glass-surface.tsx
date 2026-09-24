import { GlassView, type GlassStyle } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import { View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '../hooks';
import { isGlassSupported } from '../utils';

export type TGlassSurface = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
  glassEffectStyle?: GlassStyle;
  tintColor?: ColorValue;
  isInteractive?: boolean;
};

export function GlassSurface({
  children,
  style,
  fallbackStyle,
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive = false,
}: TGlassSurface) {
  const { scheme } = useAppTheme();

  if (!isGlassSupported) {
    return <View style={[style, fallbackStyle]}>{children}</View>;
  }

  return (
    <GlassView
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      isInteractive={isInteractive}
      colorScheme={scheme}
      style={style}>
      {children}
    </GlassView>
  );
}
