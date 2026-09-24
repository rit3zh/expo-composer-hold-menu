import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { TPalette } from '../constants';
import { useThemedStyles } from '../hooks';

const INSET = 10;
const OVERDRAG_LIMIT = 40;
const ENTER_SPRING = { mass: 1, stiffness: 250, damping: 26 };
const EXIT_SPRING = { mass: 1, stiffness: 250, damping: 40, overshootClamping: true };
const SETTLE_SPRING = { mass: 1, stiffness: 380, damping: 28 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const rubberBand = (overdrag: number) => {
  'worklet';
  return OVERDRAG_LIMIT * (1 - 1 / ((overdrag * 0.55) / OVERDRAG_LIMIT + 1));
};

type TBottomSheet = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BottomSheet({ visible, onClose, children, style }: TBottomSheet) {
  const styles = useThemedStyles(createStyles);
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(windowHeight);
  const sheetHeight = useSharedValue(windowHeight);
  const dragStart = useSharedValue(0);
  const isClosing = useSharedValue(!visible);
  const isVisible = useSharedValue(visible);

  const getHiddenOffset = useCallback(() => {
    'worklet';
    return sheetHeight.get() + INSET;
  }, [sheetHeight]);

  const handleExited = useCallback(() => {
    'worklet';
    if (isVisible.get()) {
      isClosing.set(false);
      translateY.set(withSpring(0, ENTER_SPRING));
    }
  }, [isClosing, isVisible, translateY]);

  const handleSheetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      sheetHeight.set(event.nativeEvent.layout.height);
    },
    [sheetHeight]
  );

  useEffect(() => {
    isVisible.set(visible);
    if (visible) {
      Keyboard.dismiss();
    }
  }, [isVisible, visible]);

  useEffect(() => {
    if (visible) {
      isClosing.set(false);
      translateY.set(Math.min(translateY.get(), getHiddenOffset()));
      translateY.set(withSpring(0, ENTER_SPRING));
      return;
    }
    if (isClosing.get()) {
      return;
    }
    isClosing.set(true);
    translateY.set(withSpring(getHiddenOffset(), EXIT_SPRING));
  }, [getHiddenOffset, isClosing, translateY, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose, visible]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onStart(() => {
          dragStart.set(translateY.get());
        })
        .onUpdate((event) => {
          if (isClosing.get()) {
            return;
          }
          const offset = dragStart.get() + event.translationY;
          translateY.set(offset >= 0 ? offset : -rubberBand(-offset));
        })
        .onEnd((event) => {
          if (isClosing.get()) {
            return;
          }
          if (translateY.get() > 120 || event.velocityY > 800) {
            isClosing.set(true);
            translateY.set(
              withSpring(
                getHiddenOffset(),
                { ...EXIT_SPRING, velocity: event.velocityY },
                (finished) => {
                  if (finished) {
                    handleExited();
                  }
                }
              )
            );
            scheduleOnRN(onClose);
            return;
          }
          translateY.set(withSpring(0, { ...SETTLE_SPRING, velocity: event.velocityY }));
        }),
    [dragStart, getHiddenOffset, handleExited, isClosing, onClose, translateY]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, getHiddenOffset()], [1, 0], Extrapolation.CLAMP),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return (
    <View
      accessibilityViewIsModal={visible}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[styles.root, !visible && styles.passThrough]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={onClose}
        style={[styles.backdrop, backdropStyle]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View onLayout={handleSheetLayout} style={[styles.sheet, sheetStyle]} />
      </GestureDetector>
    </View>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFill,
      pointerEvents: 'box-none',
    },
    passThrough: {
      pointerEvents: 'none',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: palette.sheetBackdrop,
    },
    sheet: {
      position: 'absolute',
      left: INSET,
      right: INSET,
      bottom: INSET,
    },
    card: {
      borderRadius: 46,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.sheetEdge,
      backgroundColor: palette.sheetBackground,
    },
  });
