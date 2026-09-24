import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { TPalette } from '../constants';
import { useThemedStyles } from '../hooks';

const PEEK_WIDTH = 110;
const CORNER_RADIUS = 48;
const SPRING = { mass: 1, stiffness: 280, damping: 33 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const dismissKeyboard = () => {
  Keyboard.dismiss();
};

type TDrawer = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  progress: SharedValue<number>;
  drawerContent: ReactNode;
  children: ReactNode;
};

export function Drawer({ isOpen, onOpenChange, progress, drawerContent, children }: TDrawer) {
  const styles = useThemedStyles(createStyles);
  const { width: windowWidth } = useWindowDimensions();
  const drawerWidth = windowWidth - PEEK_WIDTH;

  const dragStart = useSharedValue(0);
  const target = useSharedValue(0);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
    }
    const next = isOpen ? 1 : 0;
    if (target.get() === next) {
      return;
    }
    target.set(next);
    progress.set(withSpring(next, SPRING));
  }, [isOpen, progress, target]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => subscription.remove();
  }, [close, isOpen]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-12, 12])
        .onStart((event) => {
          dragStart.set(progress.get());
          if (event.translationX > 0) {
            scheduleOnRN(dismissKeyboard);
          }
        })
        .onUpdate((event) => {
          progress.set(clamp(dragStart.get() + event.translationX / drawerWidth, 0, 1));
        })
        .onEnd((event) => {
          const shouldOpen =
            Math.abs(event.velocityX) > 500 ? event.velocityX > 0 : progress.get() > 0.5;
          const next = shouldOpen ? 1 : 0;
          target.set(next);
          progress.set(withSpring(next, { ...SPRING, velocity: event.velocityX / drawerWidth }));
          scheduleOnRN(onOpenChange, shouldOpen);
        }),
    [dragStart, drawerWidth, onOpenChange, progress, target]
  );

  const drawerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1], [0, 1]),
    transform: [
      { translateX: interpolate(progress.get(), [0, 1], [-44, 0], Extrapolation.CLAMP) },
      { scale: interpolate(progress.get(), [0, 1], [0.9, 1], Extrapolation.CLAMP) },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.get(), [0, 1], [0, drawerWidth], Extrapolation.CLAMP) },
    ],
    borderRadius: interpolate(progress.get(), [0, 0.2], [0, CORNER_RADIUS], Extrapolation.CLAMP),
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1], [0, 1], Extrapolation.CLAMP),
    borderRadius: interpolate(progress.get(), [0, 0.2], [0, CORNER_RADIUS], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.root}>
        <Animated.View
          accessibilityElementsHidden={!isOpen}
          importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
          style={[styles.drawer, { width: drawerWidth }, drawerStyle]}>
          {drawerContent}
        </Animated.View>
        <Animated.View style={[styles.content, contentStyle]}>
          {children}
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Close sidebar"
            accessibilityElementsHidden={!isOpen}
            importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
            onPress={close}
            style={[styles.scrim, !isOpen && styles.passThrough, scrimStyle]}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.sidebarBackground,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
    },
    content: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
      borderCurve: 'continuous',
      backgroundColor: palette.background,
    },
    scrim: {
      ...StyleSheet.absoluteFill,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.drawerEdge,
      backgroundColor: palette.drawerScrim,
    },
    passThrough: {
      pointerEvents: 'none',
    },
  });
