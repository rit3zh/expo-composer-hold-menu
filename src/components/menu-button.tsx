import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { useAppTheme } from '../hooks';
import { MenuIcon } from '../icons';
import { GlassPressable, type TGlassPressable } from './glass-pressable';

type TMenuButton = Omit<TGlassPressable, 'children'> & {
  progress?: SharedValue<number>;
  isOpen?: boolean;
};

export function MenuButton({ progress, isOpen = false, style, ...props }: TMenuButton) {
  const { palette } = useAppTheme();

  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={isOpen ? 'Close sidebar' : 'Open sidebar'}
      {...props}
      style={[styles.button, style]}>
      <MenuIcon progress={progress} size={24} color={palette.buttonIcon} />
    </GlassPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
