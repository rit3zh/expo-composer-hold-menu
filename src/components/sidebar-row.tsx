import { Pressable, StyleSheet, Text } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import type { TIconComponent } from '../types';

export type TSidebarItem = {
  id: string;
  label: string;
};

type TSidebarRow = {
  item: TSidebarItem;
  icon?: TIconComponent;
  onPress?: (id: string) => void;
};

export function SidebarRow({ item, icon: Icon, onPress }: TSidebarRow) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={() => onPress?.(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {Icon ? <Icon size={24} color={palette.sidebarIcon} /> : null}
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    row: {
      height: 48,
      marginHorizontal: 12,
      paddingHorizontal: 12,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    pressed: {
      backgroundColor: palette.sidebarRowPressed,
    },
    label: {
      ...typography.body,
      flexShrink: 1,
      color: palette.sidebarText,
    },
  });
