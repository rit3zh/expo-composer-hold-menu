import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AuthSheet,
  Composer,
  Drawer,
  EmptyState,
  HeaderBar,
  Sidebar,
  SuggestionList,
} from '../components';
import type { TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';

const HAS_SHOWCASE = Platform.OS === 'android';

export function ChatScreen() {
  const { isDark } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthSheetVisible, setIsAuthSheetVisible] = useState(false);
  const sidebarProgress = useSharedValue(0);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((isOpen) => !isOpen);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const startNewChat = useCallback(() => {
    setMessage('');
    setIsSidebarOpen(false);
  }, []);

  const startImagePrompt = useCallback(() => {
    setMessage('Create an image of ');
  }, []);

  const openAuthSheet = useCallback(() => {
    setIsAuthSheetVisible(true);
  }, []);

  const closeAuthSheet = useCallback(() => {
    setIsAuthSheetVisible(false);
  }, []);

  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <View style={styles.root}>
      <Drawer
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        progress={sidebarProgress}
        drawerContent={<Sidebar onItemPress={closeSidebar} onNewChatPress={startNewChat} />}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <HeaderBar
            onMenuPress={toggleSidebar}
            menuProgress={sidebarProgress}
            isMenuOpen={isSidebarOpen}
            onUpgradePress={openAuthSheet}
          />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={8 - bottomInset}
            style={styles.body}>
            <View style={styles.conversation}>
              <Pressable
                accessible={false}
                onPress={Keyboard.dismiss}
                style={StyleSheet.absoluteFill}
              />
              {HAS_SHOWCASE && <EmptyState onActionPress={startImagePrompt} />}
            </View>
            {!HAS_SHOWCASE && <SuggestionList />}
            <Composer
              value={message}
              onChangeText={setMessage}
              style={{ marginBottom: bottomInset }}
            />
          </KeyboardAvoidingView>
        </View>
      </Drawer>
      <AuthSheet visible={isAuthSheetVisible} onClose={closeAuthSheet} />
    </View>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    body: {
      flex: 1,
    },
    conversation: {
      flex: 1,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
