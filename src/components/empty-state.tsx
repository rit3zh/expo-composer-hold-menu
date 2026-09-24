import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { typography, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { GlassPressable } from './glass-pressable';

const IMAGES = [
  'https://i.pinimg.com/736x/c2/1e/e9/c21ee98364d89c1c4febc6c4c2bcc36d.jpg',
  'https://i.pinimg.com/736x/a0/89/3b/a0893bd0babbda5689dbd801365e8467.jpg',
  'https://i.pinimg.com/736x/d0/5d/48/d05d482bb7d42b3f26aa9ff985c9e969.jpg',
  'https://i.pinimg.com/1200x/81/71/a4/8171a465b637b892105b9ce9bec1b7b5.jpg',
  'https://i.pinimg.com/736x/1a/44/05/1a4405dc3d9523a732eecdab9b2dbd1e.jpg',
];

const CARD_SIZE = 70;
const ARC_RADIUS = 400;
const ARC_STEP = 15;
const MIDDLE = (IMAGES.length - 1) / 2;

const CARD_POSES: ImageStyle[] = IMAGES.map((_, index) => {
  const step = index - MIDDLE;
  const angle = (step * ARC_STEP * Math.PI) / 180;
  return {
    top: ARC_RADIUS * (1 - Math.cos(angle)),
    transform: [
      { translateX: ARC_RADIUS * Math.sin(angle) - CARD_SIZE / 2 },
      { rotate: `${step * ARC_STEP}deg` },
    ],
  };
});

const ARC_HEIGHT = CARD_SIZE + Math.max(...CARD_POSES.map((pose) => Number(pose.top)));

type TEmptyState = {
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const EmptyState = memo(function EmptyState({ onActionPress, style }: TEmptyState) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.arc}>
        {IMAGES.map((uri, index) => (
          <Image
            key={uri}
            source={uri}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={[styles.card, CARD_POSES[index]]}
          />
        ))}
        <LinearGradient
          colors={[
            palette.emptyStateFade,
            palette.emptyStateFadeClear,
            palette.emptyStateFadeClear,
            palette.emptyStateFade,
          ]}
          locations={[0, 0.2, 0.8, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
          style={styles.fade}
        />
      </View>
      <Text style={styles.title}>Image creation got a major upgrade</Text>
      <Text style={styles.description}>
        Higher-quality results, faster generation, and smarter creative tools
      </Text>
      <GlassPressable
        glassEffectStyle="none"
        accessibilityRole="button"
        accessibilityLabel="Try it"
        onPress={onActionPress}
        style={styles.action}>
        <Text style={styles.actionLabel}>Try it</Text>
      </GlassPressable>
    </View>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    arc: {
      alignSelf: 'stretch',
      height: ARC_HEIGHT,
    },
    fade: {
      position: 'absolute',
      top: -CARD_SIZE / 2,
      bottom: -CARD_SIZE / 2,
      left: 0,
      right: 0,
    },
    card: {
      position: 'absolute',
      left: '50%',
      width: CARD_SIZE,
      height: CARD_SIZE,
      borderRadius: 16,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.emptyStateCardBorder,
      backgroundColor: palette.emptyStateCardBackground,
    },
    title: {
      ...typography.title,
      marginTop: 40,
      paddingHorizontal: 32,
      color: palette.emptyStateTitle,
      textAlign: 'center',
    },
    description: {
      ...typography.paragraph,
      marginTop: 8,
      paddingHorizontal: 32,
      color: palette.emptyStateDescription,
      textAlign: 'center',
    },
    action: {
      marginTop: 28,
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 30,
      justifyContent: 'center',
      backgroundColor: palette.emptyStateActionBackground,
    },
    actionLabel: {
      ...typography.bodySemibold,
      color: palette.emptyStateActionText,
    },
  });
