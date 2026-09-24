import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { AppleIcon, ChatGPTIcon, EnvelopeIcon, GoogleIcon } from '../icons';
import { AuthButton } from './auth-button';
import { BottomSheet } from './bottom-sheet';

type TAuthSheet = {
  visible: boolean;
  onClose: () => void;
  onContinueWithApple?: () => void;
  onContinueWithGoogle?: () => void;
  onSignUpWithEmail?: () => void;
};

export const AuthSheet = memo(function AuthSheet({
  visible,
  onClose,
  onContinueWithApple,
  onContinueWithGoogle,
  onSignUpWithEmail,
}: TAuthSheet) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.appIcon}>
          <ChatGPTIcon size={70} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          Get Started
        </Text>
        <Text style={styles.description}>
          {'ChatGPT helps you think, write,\nand create at your highest level.'}
        </Text>
        <View style={styles.actions}>
          {Platform.OS === 'ios' ? (
            <AuthButton
              label="Continue with Apple"
              icon={<AppleIcon size={20} color={palette.authPrimaryText} />}
              variant="primary"
              onPress={onContinueWithApple}
            />
          ) : (
            <AuthButton
              label="Continue with Google"
              icon={<GoogleIcon size={17} />}
              variant="primary"
              onPress={onContinueWithGoogle}
            />
          )}
          <AuthButton
            label="Sign up with email"
            icon={<EnvelopeIcon size={22} color={palette.authSecondaryText} />}
            onPress={onSignUpWithEmail}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    content: {
      padding: 24,
      paddingBottom: 30,
    },
    appIcon: {
      alignSelf: 'flex-start',
      borderRadius: 16,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.appIconBorder,
      overflow: 'hidden',
    },
    title: {
      ...typography.title,
      marginTop: 18,
      color: palette.sheetTitle,
    },
    description: {
      ...typography.paragraph,
      marginTop: 6,
      color: palette.sheetDescription,
    },
    actions: {
      marginTop: 36,
      marginHorizontal: -4,
      gap: 12,
    },
  });
