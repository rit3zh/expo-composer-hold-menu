import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { GlassPressable, type TGlassPressable } from './glass-pressable';

type TAuthButton = Pick<TGlassPressable, 'onPress'> & {
  label: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function AuthButton({ label, icon, variant = 'secondary', onPress }: TAuthButton) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const isPrimary = variant === 'primary';

  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      tintColor={isPrimary ? palette.authPrimaryBackground : palette.authSecondaryTint}
      style={styles.button}
      fallbackStyle={isPrimary ? styles.primaryFallback : styles.secondaryFallback}>
      {icon}
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </GlassPressable>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    button: {
      height: 56,
      borderRadius: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    primaryFallback: {
      backgroundColor: palette.authPrimaryBackground,
    },
    secondaryFallback: {
      backgroundColor: palette.authSecondaryBackground,
    },
    label: {
      ...typography.bodySemibold,
    },
    primaryLabel: {
      color: palette.authPrimaryText,
    },
    secondaryLabel: {
      color: palette.authSecondaryText,
    },
  });
