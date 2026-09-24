import { StyleSheet } from 'react-native';

import { useAppTheme } from '../hooks';
import type { TIconComponent } from '../types';
import { GlassPressable, type TGlassPressable } from './glass-pressable';

type TIconButton = Omit<TGlassPressable, 'children'> & {
  icon: TIconComponent;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  iconStrokeWidth?: number;
};

export function IconButton({
  icon: Icon,
  size = 44,
  iconSize = 24,
  iconColor,
  iconStrokeWidth,
  style,
  ...props
}: TIconButton) {
  const { palette } = useAppTheme();

  return (
    <GlassPressable
      accessibilityRole="button"
      {...props}
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Icon size={iconSize} color={iconColor ?? palette.buttonIcon} strokeWidth={iconStrokeWidth} />
    </GlassPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
