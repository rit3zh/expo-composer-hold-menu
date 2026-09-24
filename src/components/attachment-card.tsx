import { Image } from 'expo-image';
import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { COMPOSER_SHELF, type TPalette } from '../constants';
import { useAppTheme, useThemedStyles } from '../hooks';
import { PlusIcon } from '../icons';
import type { TComposerDock, TRecentPhoto } from '../types';
import { GlassPressable } from './glass-pressable';

const BADGE_SIZE = 24;
const BADGE_OFFSET = 7;
const EXIT_SCALE = 0.6;
const EXIT_TIMING = { duration: 280, easing: Easing.bezier(0.4, 0, 0.2, 1) };
const BADGE_TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

const reflow = LinearTransition.duration(260).easing(Easing.out(Easing.cubic));

type TAttachmentCard = {
  photo: TRecentPhoto;
  index: number;
  dock: TComposerDock;
  isLeaving: boolean;
  onRemove: (id: string) => void;
  onExited: (id: string) => void;
};

export const AttachmentCard = memo(function AttachmentCard({
  photo,
  index,
  dock,
  isLeaving,
  onRemove,
  onExited,
}: TAttachmentCard) {
  const { palette } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { pendingCard } = dock;
  const badgeScale = useSharedValue(0);
  const exit = useSharedValue(0);

  useAnimatedReaction(
    () => pendingCard.get() === index,
    (isAwaiting, wasAwaiting) => {
      if (wasAwaiting === null) {
        badgeScale.set(isAwaiting ? 0 : 1);
        return;
      }
      if (wasAwaiting && !isAwaiting) {
        badgeScale.set(withTiming(1, BADGE_TIMING));
      }
    }
  );

  useEffect(() => {
    if (!isLeaving) {
      return;
    }
    badgeScale.set(withTiming(0, EXIT_TIMING));
    exit.set(
      withTiming(1, EXIT_TIMING, (finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(onExited, photo.id);
        }
      })
    );
  }, [badgeScale, exit, isLeaving, onExited, photo.id]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - EXIT_SCALE) * exit.get() }],
  }));

  const photoStyle = useAnimatedStyle(() => ({
    opacity: pendingCard.get() === index ? 0 : 1 - exit.get(),
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.get() }],
  }));

  return (
    <Animated.View layout={reflow} style={[styles.card, cardStyle]}>
      <Animated.View style={[styles.photo, photoStyle]}>
        <Image
          source={photo.uri}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.badgeAnchor, badgeStyle]}>
        <GlassPressable
          accessibilityRole="button"
          accessibilityLabel="Remove photo"
          hitSlop={BADGE_OFFSET * 2}
          onPress={() => onRemove(photo.id)}
          tintColor={palette.cardBadgeTint}
          style={styles.badge}
          fallbackStyle={styles.badgeFallback}>
          <View style={styles.badgeGlyph}>
            <PlusIcon size={16} color="#FFFFFF" />
          </View>
        </GlassPressable>
      </Animated.View>
    </Animated.View>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    card: {
      width: COMPOSER_SHELF.CARD_SIZE,
      height: COMPOSER_SHELF.CARD_SIZE,
    },
    photo: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
      borderRadius: COMPOSER_SHELF.CARD_RADIUS,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.holdMenuTileBorder,
      backgroundColor: palette.holdMenuTileBackground,
    },
    badgeAnchor: {
      position: 'absolute',
      top: BADGE_OFFSET,
      right: BADGE_OFFSET,
    },
    badge: {
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: BADGE_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeFallback: {
      backgroundColor: palette.cardBadgeBackground,
    },
    badgeGlyph: {
      transform: [{ rotate: '45deg' }],
    },
  });
