import { StyleSheet, Text } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { ComposeIcon } from '../icons';
import { GlassPressable, type TGlassPressable } from './glass-pressable';

type TNewChatButton = Omit<TGlassPressable, 'children'> & {
  label?: string;
};

export function NewChatButton({
  label = 'Chat',
  tintColor,
  style,
  fallbackStyle,
  ...props
}: TNewChatButton) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel="New chat"
      tintColor={tintColor ?? palette.newChatButton}
      {...props}
      style={[styles.button, style]}
      fallbackStyle={[styles.fallback, fallbackStyle]}>
      <ComposeIcon size={24} color={palette.newChatText} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </GlassPressable>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    button: {
      height: 48,
      borderRadius: 24,
      paddingLeft: 22,
      paddingRight: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    fallback: {
      backgroundColor: palette.newChatButton,
    },
    label: {
      ...typography.bodySemibold,
      color: palette.newChatText,
    },
  });
