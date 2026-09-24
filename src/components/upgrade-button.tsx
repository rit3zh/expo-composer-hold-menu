import { StyleSheet, Text } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { SparkleIcon } from '../icons';
import { GlassPressable, type TGlassPressable } from './glass-pressable';

type TUpgradeButton = Omit<TGlassPressable, 'children'> & {
  label?: string;
};

export function UpgradeButton({ label = 'Upgrade', style, ...props }: TUpgradeButton) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
      style={[styles.button, style]}>
      <SparkleIcon size={20} color={palette.upgrade} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </GlassPressable>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    button: {
      height: 44,
      borderRadius: 22,
      paddingLeft: 16,
      paddingRight: 15,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    label: {
      ...typography.bodySemibold,
      color: palette.upgrade,
    },
  });
