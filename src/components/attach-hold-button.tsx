import { Image } from 'expo-image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  COMPOSER_LAYOUT,
  COMPOSER_SHELF,
  HOLD_MENU_ANIMATION,
  HOLD_MENU_LAYOUT,
} from '../constants';
import { useAppTheme } from '../hooks';
import { PlusIcon } from '../icons';
import type { TComposerDock, TRecentPhoto } from '../types';
import { findTileIndex, getTrayMetrics } from '../utils';
import { PhotoHoldMenu } from './photo-hold-menu';

const HOLD_DURATION = 280;
const DOCK_TIMING = { duration: 440, easing: Easing.bezier(0.22, 1, 0.36, 1) };
const BUTTON_RADIUS = COMPOSER_LAYOUT.ACTION_SIZE / 2;

type TAttachHoldButton = {
  photos: readonly TRecentPhoto[];
  dock: TComposerDock;
  attachmentCount: number;
  onPress?: () => void;
  onPhotoSelect?: (photo: TRecentPhoto) => void;
};

export const AttachHoldButton = memo(function AttachHoldButton({
  photos,
  dock,
  attachmentCount,
  onPress,
  onPhotoSelect,
}: TAttachHoldButton) {
  const { palette } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [bandAnchorY, setBandAnchorY] = useState(0);
  const { pendingCard, dockProgress } = dock;

  const anchorX = useSharedValue(0);
  const anchorY = useSharedValue(0);
  const open = useSharedValue(0);
  const isOpen = useSharedValue(false);
  const isTouching = useSharedValue(false);
  const hovered = useSharedValue(-1);
  const dockingIndex = useSharedValue(-1);

  const tiles = useMemo(() => photos.slice(0, HOLD_MENU_LAYOUT.MAX_TILES), [photos]);
  const tileCount = tiles.length;
  const canAttach = attachmentCount < COMPOSER_SHELF.MAX_CARDS;

  useEffect(() => {
    if (tiles.length > 0) {
      Image.prefetch(tiles.map((photo) => photo.uri));
    }
  }, [tiles]);

  const mountMenu = useCallback((anchor: number) => {
    setBandAnchorY(anchor);
    setIsMenuMounted(true);
  }, []);

  const unmountMenu = useCallback(() => {
    setIsMenuMounted(false);
  }, []);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const handleSelect = useCallback(
    (index: number) => {
      const photo = tiles[index];
      if (photo) {
        onPhotoSelect?.(photo);
      }
    },
    [onPhotoSelect, tiles]
  );

  const unmountWhenIdle = useCallback(() => {
    'worklet';
    const isDocking = dockingIndex.get() >= 0 && pendingCard.get() >= 0;
    if (!isTouching.get() && open.get() < HOLD_MENU_ANIMATION.SETTLED && !isDocking) {
      scheduleOnRN(unmountMenu);
    }
  }, [dockingIndex, isTouching, open, pendingCard, unmountMenu]);

  const unmountWhenSettled = useCallback(
    (finished?: boolean) => {
      'worklet';
      if (finished) {
        unmountWhenIdle();
      }
    },
    [unmountWhenIdle]
  );

  const closeMenu = useCallback(() => {
    'worklet';
    isOpen.set(false);
    hovered.set(-1);
    open.set(withSpring(0, HOLD_MENU_ANIMATION.CLOSE_SPRING, unmountWhenSettled));
  }, [hovered, isOpen, open, unmountWhenSettled]);

  const selectTile = useCallback(
    (index: number) => {
      'worklet';
      dockingIndex.set(index);
      pendingCard.set(attachmentCount);
      dockProgress.set(
        withTiming(1, DOCK_TIMING, (finished) => {
          'worklet';
          if (finished) {
            pendingCard.set(-1);
            unmountWhenIdle();
          }
        })
      );
      scheduleOnRN(handleSelect, index);
      closeMenu();
    },
    [
      attachmentCount,
      closeMenu,
      dockProgress,
      dockingIndex,
      handleSelect,
      pendingCard,
      unmountWhenIdle,
    ]
  );

  const gesture = useMemo(() => {
    const hold = Gesture.Pan()
      .enabled(tileCount > 0 && canAttach)
      .activateAfterLongPress(HOLD_DURATION)
      .onBegin((event) => {
        anchorX.set(event.absoluteX - event.x + BUTTON_RADIUS);
        anchorY.set(event.absoluteY - event.y + BUTTON_RADIUS);
        dockingIndex.set(-1);
        dockProgress.set(0);
        pendingCard.set(-1);
        isTouching.set(true);
        scheduleOnRN(mountMenu, anchorY.get());
      })
      .onStart(() => {
        isOpen.set(true);
        open.set(withSpring(1, HOLD_MENU_ANIMATION.OPEN_SPRING));
      })
      .onUpdate((event) => {
        const tray = getTrayMetrics(tileCount, windowWidth, anchorY.get());
        const next = findTileIndex(event.absoluteX, event.absoluteY, tileCount, tray);
        if (next !== hovered.get()) {
          hovered.set(next);
        }
      })
      .onFinalize(() => {
        isTouching.set(false);
        if (!isOpen.get()) {
          closeMenu();
          return;
        }
        const selected = hovered.get();
        if (selected >= 0) {
          selectTile(selected);
        }
      });

    const tap = Gesture.Tap().onEnd((_event, success) => {
      if (success) {
        scheduleOnRN(handlePress);
      }
    });

    return Gesture.Exclusive(hold, tap);
  }, [
    anchorX,
    anchorY,
    canAttach,
    closeMenu,
    dockProgress,
    dockingIndex,
    handlePress,
    hovered,
    isOpen,
    isTouching,
    pendingCard,
    mountMenu,
    open,
    selectTile,
    tileCount,
    windowWidth,
  ]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: open.get() > HOLD_MENU_ANIMATION.SETTLED ? 0 : 1,
    transform: [{ rotate: `${open.get() * HOLD_MENU_LAYOUT.ICON_ROTATION}deg` }],
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          accessible
          accessibilityRole="button"
          accessibilityLabel="Add photos and files"
          accessibilityHint="Hold to pick a recent photo"
          accessibilityState={{ disabled: !canAttach }}
          onAccessibilityTap={handlePress}
          hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
          style={[styles.button, !canAttach && styles.buttonDisabled]}>
          <Animated.View style={iconStyle}>
            <PlusIcon size={COMPOSER_LAYOUT.ICON_SIZE} color={palette.composerIcon} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <PhotoHoldMenu
        visible={isMenuMounted}
        bandAnchorY={bandAnchorY}
        dock={dock}
        photos={tiles}
        anchorX={anchorX}
        anchorY={anchorY}
        dockingIndex={dockingIndex}
        open={open}
        isOpen={isOpen}
        isTouching={isTouching}
        hovered={hovered}
        onSelect={selectTile}
        onDismiss={closeMenu}
      />
    </>
  );
});

const styles = StyleSheet.create({
  button: {
    width: COMPOSER_LAYOUT.ACTION_SIZE,
    height: COMPOSER_LAYOUT.ACTION_SIZE,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
