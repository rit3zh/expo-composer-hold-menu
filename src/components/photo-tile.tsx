import { GaussianBlurView } from 'expo-backdrop';
import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { COMPOSER_SHELF, HOLD_MENU_ANIMATION, HOLD_MENU_LAYOUT, type TPalette } from '../constants';
import { useThemedStyles } from '../hooks';
import type { TComposerDock, THoldMenuState, TRecentPhoto } from '../types';
import { getBlurMix, getDockTarget, getSpreadPeak, getTileCenterX, getTrayMetrics } from '../utils';

type TPhotoTile = THoldMenuState & {
  dock: TComposerDock;
  photo: TRecentPhoto;
  index: number;
  count: number;
  windowWidth: number;
};

export const PhotoTile = memo(function PhotoTile({
  photo,
  index,
  count,
  windowWidth,
  anchorX,
  anchorY,
  open,
  isOpen,
  hovered,
  dockingIndex,
  dock,
}: TPhotoTile) {
  const styles = useThemedStyles(createStyles);
  const { pendingCard, dockProgress } = dock;

  const lift = useSharedValue(0);
  const move = useSharedValue(0);
  const hover = useSharedValue(0);

  const depth = count > 1 ? index / (count - 1) : 0;

  useAnimatedReaction(
    () => isOpen.get(),
    (current, previous) => {
      if (current === previous || (!current && previous === null)) {
        return;
      }
      if (current) {
        lift.set(0);
        move.set(0);
        lift.set(withSpring(1, HOLD_MENU_ANIMATION.TILE_LIFT_SPRING));
        move.set(
          withDelay(
            HOLD_MENU_ANIMATION.SPREAD_DELAY + index * HOLD_MENU_ANIMATION.OPEN_STAGGER,
            withSpring(1, HOLD_MENU_ANIMATION.TILE_MOVE_SPRING)
          )
        );
        return;
      }
      if (dockingIndex.get() >= 0) {
        return;
      }
      move.set(
        withDelay(
          (count - 1 - index) * HOLD_MENU_ANIMATION.CLOSE_STAGGER,
          withSpring(0, HOLD_MENU_ANIMATION.TILE_CLOSE_SPRING)
        )
      );
      lift.set(
        withDelay(
          HOLD_MENU_ANIMATION.COLLAPSE_DELAY,
          withSpring(0, HOLD_MENU_ANIMATION.TILE_CLOSE_SPRING)
        )
      );
    }
  );

  useAnimatedReaction(
    () => hovered.get() === index,
    (isHovered, wasHovered) => {
      if (isHovered !== wasHovered) {
        hover.set(withSpring(isHovered ? 1 : 0, HOLD_MENU_ANIMATION.HOVER_SPRING));
      }
    }
  );

  const size = getTrayMetrics(count, windowWidth, 0).size;
  const dockedRadius = (COMPOSER_SHELF.CARD_RADIUS * size) / COMPOSER_SHELF.CARD_SIZE;

  const tileStyle = useAnimatedStyle(() => {
    const tray = getTrayMetrics(count, windowWidth, anchorY.get());
    const spread = Math.min(Math.max(move.get(), 0), 1);
    const stackX = anchorX.get() + index * HOLD_MENU_LAYOUT.STACK_OFFSET;
    const arc = HOLD_MENU_LAYOUT.TRAIL_ARC * depth * getSpreadPeak(move.get());
    const centerX = stackX + (getTileCenterX(index, tray) - stackX) * move.get();
    const centerY =
      anchorY.get() +
      (tray.centerY - anchorY.get()) * lift.get() -
      index * HOLD_MENU_LAYOUT.STACK_OFFSET * (1 - spread) -
      arc;
    const scale =
      (HOLD_MENU_LAYOUT.START_SCALE +
        (HOLD_MENU_LAYOUT.STACK_SCALE - HOLD_MENU_LAYOUT.START_SCALE) * lift.get() +
        (1 - HOLD_MENU_LAYOUT.STACK_SCALE) * move.get()) *
      (1 + (HOLD_MENU_LAYOUT.HOVER_SCALE - 1) * hover.get());
    const rotation =
      (HOLD_MENU_LAYOUT.START_ROTATION + index * HOLD_MENU_LAYOUT.ROTATION_STEP) * (1 - spread);
    const trailFade = 1 - HOLD_MENU_LAYOUT.TRAIL_FADE * depth * getSpreadPeak(move.get());

    if (dockingIndex.get() === index) {
      const card = pendingCard.get();
      const t = dockProgress.get();
      const target = getDockTarget(Math.max(card, 0), anchorX.get(), anchorY.get());
      const cardScale = COMPOSER_SHELF.CARD_SIZE / tray.size;
      return {
        opacity: card < 0 ? 0 : 1,
        transform: [
          { translateX: interpolate(t, [0, 1], [centerX, target.x]) - tray.size / 2 },
          { translateY: interpolate(t, [0, 1], [centerY, target.y]) - tray.size / 2 },
          { rotate: `${interpolate(t, [0, 1], [rotation, 0])}deg` },
          { scale: interpolate(t, [0, 1], [scale, cardScale]) },
        ],
      };
    }

    if (dockingIndex.get() >= 0) {
      const settle = interpolate(
        open.get(),
        [0, 1],
        [HOLD_MENU_LAYOUT.DISMISS_SCALE, 1],
        Extrapolation.CLAMP
      );
      return {
        opacity: trailFade * interpolate(open.get(), [0.25, 1], [0, 1], Extrapolation.CLAMP),
        transform: [
          { translateX: centerX - tray.size / 2 },
          { translateY: centerY - tray.size / 2 },
          { rotate: `${rotation}deg` },
          { scale: scale * settle },
        ],
      };
    }

    const liftFade = interpolate(lift.get(), [0, 0.25], [0, 1], Extrapolation.CLAMP);
    return {
      opacity:
        trailFade *
        (isOpen.get()
          ? Math.min(liftFade, interpolate(open.get(), [0, 0.3], [0, 1], Extrapolation.CLAMP))
          : liftFade),
      transform: [
        { translateX: centerX - tray.size / 2 },
        { translateY: centerY - tray.size / 2 },
        { rotate: `${rotation}deg` },
        { scale },
      ],
    };
  });

  const blurStyle = useAnimatedStyle(() => ({
    opacity: getBlurMix(depth, move.get(), lift.get(), isOpen.get()),
  }));

  const sharpStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      getBlurMix(depth, move.get(), lift.get(), isOpen.get()),
      [0, 1],
      [1, 0.15],
      Extrapolation.CLAMP
    ),
    borderRadius:
      dockingIndex.get() === index
        ? interpolate(dockProgress.get(), [0, 1], [HOLD_MENU_LAYOUT.TILE_RADIUS, dockedRadius])
        : HOLD_MENU_LAYOUT.TILE_RADIUS,
  }));

  return (
    <Animated.View style={[styles.tile, { width: size, height: size }, tileStyle]}>
      <Animated.View style={[styles.photo, sharpStyle]}>
        <Image
          source={photo.uri}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
        <GaussianBlurView
          blurRadius={HOLD_MENU_LAYOUT.TILE_BLUR_RADIUS}
          style={StyleSheet.absoluteFill}>
          <Image
            source={photo.uri}
            contentFit="cover"
            transition={0}
            cachePolicy="memory-disk"
            style={[StyleSheet.absoluteFill, styles.blurredPhoto]}
          />
        </GaussianBlurView>
      </Animated.View>
    </Animated.View>
  );
});

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    tile: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    photo: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
      borderRadius: HOLD_MENU_LAYOUT.TILE_RADIUS,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.holdMenuTileBorder,
      backgroundColor: palette.holdMenuTileBackground,
    },
    blurredPhoto: {
      borderRadius: HOLD_MENU_LAYOUT.TILE_RADIUS,
      borderCurve: 'continuous',
    },
  });
