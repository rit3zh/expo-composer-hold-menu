import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import {
  BooksIcon,
  BrushIcon,
  ChatBubbleIcon,
  ClockIcon,
  FolderIcon,
  GearIcon,
  HeartBadgeIcon,
  SearchIcon,
  ShapesIcon,
} from '../icons';
import { IconButton } from './icon-button';
import { NewChatButton } from './new-chat-button';
import { SidebarRow, type TSidebarItem } from './sidebar-row';

const FOOTER_HEIGHT = 48;

const NAV_ITEMS = [
  { id: 'images', label: 'Images', icon: BrushIcon },
  { id: 'library', label: 'Library', icon: BooksIcon },
  { id: 'projects', label: 'Projects', icon: FolderIcon },
  { id: 'health', label: 'Health', icon: HeartBadgeIcon },
  { id: 'scheduled', label: 'Scheduled', icon: ClockIcon },
  { id: 'explore', label: 'Explore', icon: ShapesIcon },
];

const PINNED_CHATS: TSidebarItem[] = [
  { id: 'calisthenics-beginner-guide', label: 'Calisthenics Beginner Guide' },
  { id: 'if-let-in-swift', label: 'If-let in Swift' },
  { id: 'best-ui-library', label: 'Making the best UI library for React Native' },
  { id: 'image-ripple-shader', label: 'Image Ripple Shader' },
  { id: 'tailwind-variants-alternatives', label: 'Tailwind Variants Alternatives' },
  { id: 'ios-liquid-glass-optimization', label: 'iOS Liquid Glass Optimization' },
];

const RECENT_CHATS: TSidebarItem[] = [
  { id: 'private-apis-safety', label: 'Apple Private APIs Safety' },
  { id: 'native-module-name-suggestions', label: 'Native Module Name Suggestions' },
  { id: 'motion-blur-metal-shader', label: 'Motion Blur Metal Shader' },
  { id: 'reanimated-shared-values', label: 'Reanimated Shared Values' },
  { id: 'expo-router-layouts', label: 'Expo Router Layouts' },
  { id: 'swiftui-glass-effect', label: 'SwiftUI Glass Effect' },
  { id: 'kotlin-agsl-shaders', label: 'Kotlin AGSL Shaders' },
];

type TSidebar = {
  onItemPress?: (id: string) => void;
  onNewChatPress?: () => void;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
};

export const Sidebar = memo(function Sidebar({
  onItemPress,
  onNewChatPress,
  onSearchPress,
  onSettingsPress,
}: TSidebar) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          ChatGPT
        </Text>
        <IconButton
          icon={SearchIcon}
          accessibilityLabel="Search chats"
          onPress={onSearchPress}
          tintColor={palette.buttonBackground}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + FOOTER_HEIGHT + 12 },
        ]}
        showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => (
          <SidebarRow key={item.id} item={item} icon={item.icon} onPress={onItemPress} />
        ))}
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Pinned
          </Text>
        </View>
        {PINNED_CHATS.map((chat) => (
          <SidebarRow key={chat.id} item={chat} icon={ChatBubbleIcon} onPress={onItemPress} />
        ))}
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Recents
          </Text>
        </View>
        {RECENT_CHATS.map((chat) => (
          <SidebarRow key={chat.id} item={chat} onPress={onItemPress} />
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: bottomInset }]}>
        <LinearGradient
          colors={[palette.sidebarFadeStart, palette.sidebarFadeEnd]}
          style={styles.fade}
        />
        <NewChatButton onPress={onNewChatPress} />
        <IconButton
          icon={GearIcon}
          size={FOOTER_HEIGHT}
          accessibilityLabel="Settings"
          onPress={onSettingsPress}
          tintColor={palette.buttonBackground}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
    </View>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.sidebarBackground,
    },
    header: {
      height: 44,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      ...typography.title,
      flexShrink: 1,
      color: palette.sidebarText,
    },
    content: {
      paddingTop: 12,
    },
    section: {
      height: 48,
      marginTop: 12,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    sectionTitle: {
      ...typography.bodySemibold,
      color: palette.sidebarText,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingLeft: 30,
      paddingRight: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'box-none',
    },
    fade: {
      ...StyleSheet.absoluteFill,
      pointerEvents: 'none',
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
