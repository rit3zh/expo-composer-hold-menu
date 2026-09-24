import { StyleSheet, Text } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import type { TIconComponent } from '../types';
import { GlassPressable } from './glass-pressable';

export type TSuggestion = {
  id: string;
  label: string;
  icon: TIconComponent;
};

type TSuggestionItem = {
  suggestion: TSuggestion;
  onPress?: (id: string) => void;
};

export function SuggestionItem({ suggestion, onPress }: TSuggestionItem) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const Icon = suggestion.icon;

  return (
    <GlassPressable
      glassEffectStyle="none"
      accessibilityRole="button"
      accessibilityLabel={suggestion.label}
      onPress={() => onPress?.(suggestion.id)}
      style={styles.row}>
      <Icon size={24} color={palette.suggestion} />
      <Text style={styles.label} numberOfLines={1}>
        {suggestion.label}
      </Text>
    </GlassPressable>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    row: {
      alignSelf: 'flex-start',
      height: 47,
      borderRadius: 23.5,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    label: {
      ...typography.body,
      color: palette.suggestion,
    },
  });
