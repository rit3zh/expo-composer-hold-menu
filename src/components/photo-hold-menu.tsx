import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverKeyboardView } from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { COMPOSER_LAYOUT, HOLD_MENU_ANIMATION, HOLD_MENU_LAYOUT } from '../constants';
import { useAppTheme } from '../hooks';
import { PlusIcon } from '../icons';
import type { TComposerDock, THoldMenuState, TRecentPhoto } from '../types';
import { findTileIndex, getTrayMetrics } from '../utils';
import { HoldMenuBackdrop } from './hold-menu-backdrop';
import { PhotoTile } from './photo-tile';

const ICON_RADIUS = HOLD_MENU_LAYOUT.ICON_SIZE / 2;

type TPhotoHoldMenu = THoldMenuState & {
  visible: boolean;
  bandAnchorY: number;
  dock: TComposerDock;
  photos: readonly TRecentPhoto[];
  isTouching: SharedValue<boolean>;
  onSelect: (index: number) => void;
  onDismiss: () => void;
};

export function PhotoHoldMenu({
  visible,
  bandAnchorY,
  dock,
  photos,
  anchorX,
  anchorY,
  open,
  isOpen,
  isTouching,
  hovered,
  dockingIndex,
  onSelect,
  onDismiss,
}: TPhotoHoldMenu) {
  const { palette } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isPicking = useSharedValue(false);
  const tileCount = photos.length;

  const tileSize = getTrayMetrics(tileCount, windowWidth, 0).size;
  const fadeHeight = HOLD_MENU_LAYOUT.BAND_FADE + tileSize / 2;
  const holdHeight = tileSize / 2 + HOLD_MENU_LAYOUT.TRAY_OFFSET + COMPOSER_LAYOUT.HEIGHT;
  const bandTop =
    bandAnchorY -
    COMPOSER_LAYOUT.HEIGHT / 2 -
    HOLD_MENU_LAYOUT.TRAY_OFFSET -
    tileSize -
    HOLD_MENU_LAYOUT.BAND_FADE;

  const bandStyle = useAnimatedStyle(() => ({
    opacity: interpolate(open.get(), [0.15, 1], [0, 1], Extrapolation.CLAMP),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: open.get() > HOLD_MENU_ANIMATION.SETTLED ? 1 : 0,
    transform: [
      { translateX: anchorX.get() - ICON_RADIUS },
      { translateY: anchorY.get() - ICON_RADIUS },
      { rotate: `${open.get() * HOLD_MENU_LAYOUT.ICON_ROTATION}deg` },
    ],
  }));

  const pickGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((event) => {
          if (isTouching.get() || !isOpen.get()) {
            return;
          }
          isPicking.set(true);
          const tray = getTrayMetrics(tileCount, windowWidth, anchorY.get());
          hovered.set(findTileIndex(event.absoluteX, event.absoluteY, tileCount, tray));
        })
        .onUpdate((event) => {
          if (!isPicking.get()) {
            return;
          }
          const tray = getTrayMetrics(tileCount, windowWidth, anchorY.get());
          const next = findTileIndex(event.absoluteX, event.absoluteY, tileCount, tray);
          if (next !== hovered.get()) {
            hovered.set(next);
          }
        })
        .onFinalize(() => {
          if (!isPicking.get()) {
            return;
          }
          isPicking.set(false);
          const selected = hovered.get();
          if (selected >= 0) {
            onSelect(selected);
          } else {
            onDismiss();
          }
        }),
    [anchorY, hovered, isOpen, isPicking, isTouching, onDismiss, onSelect, tileCount, windowWidth]
  );

  return (
    <OverKeyboardView visible={visible}>
      <GestureHandlerRootView style={styles.root}>
        <GestureDetector gesture={pickGesture}>
          <View style={styles.root}>
            <View style={styles.content}>
              <Animated.View style={[styles.band, { top: bandTop }, bandStyle]}>
                <HoldMenuBackdrop fadeHeight={fadeHeight} holdHeight={holdHeight} />
              </Animated.View>
              {photos
                .map((photo, index) => (
                  <PhotoTile
                    key={photo.id}
                    photo={photo}
                    index={index}
                    count={tileCount}
                    windowWidth={windowWidth}
                    anchorX={anchorX}
                    anchorY={anchorY}
                    open={open}
                    isOpen={isOpen}
                    hovered={hovered}
                    dockingIndex={dockingIndex}
                    dock={dock}
                  />
                ))
                .reverse()}
              <Animated.View style={[styles.icon, iconStyle]}>
                <PlusIcon size={HOLD_MENU_LAYOUT.ICON_SIZE} color={palette.composerIcon} />
              </Animated.View>
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </OverKeyboardView>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
