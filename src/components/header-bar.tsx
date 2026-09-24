import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { DashedChatIcon } from '../icons';
import { IconButton } from './icon-button';
import { MenuButton } from './menu-button';
import { UpgradeButton } from './upgrade-button';

type THeaderBar = {
  onMenuPress?: () => void;
  menuProgress?: SharedValue<number>;
  isMenuOpen?: boolean;
  onUpgradePress?: () => void;
  onTemporaryChatPress?: () => void;
};

export const HeaderBar = memo(function HeaderBar({
  onMenuPress,
  menuProgress,
  isMenuOpen = false,
  onUpgradePress,
  onTemporaryChatPress,
}: THeaderBar) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.leading}>
        <MenuButton
          progress={menuProgress}
          isOpen={isMenuOpen}
          onPress={onMenuPress}
          tintColor={palette.buttonBackground}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
        <UpgradeButton
          onPress={onUpgradePress}
          tintColor={palette.buttonBackground}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
      <IconButton
        icon={DashedChatIcon}
        accessibilityLabel="Turn on temporary chat"
        onPress={onTemporaryChatPress}
        tintColor={palette.buttonBackground}
        style={styles.frame}
        fallbackStyle={styles.surface}
      />
    </View>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    container: {
      height: 44,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    frame: {
      borderWidth: 1,
      borderColor: 'transparent',
    },
    surface: {
      backgroundColor: palette.buttonBackground,
      borderColor: palette.buttonBorder,
    },
  });
