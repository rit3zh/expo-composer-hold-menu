import { ProgressiveBlurView } from 'expo-backdrop';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useAppTheme } from '../hooks';

const BLUR_INTENSITY = 25;
const SEAM_FADE = 36;
const HAS_FROST = Platform.OS === 'android';
const BLUR_TINT = {
  light: 'systemUltraThinMaterialLight',
  dark: 'systemUltraThinMaterialDark',
} as const;

type THoldMenuBackdrop = {
  fadeHeight: number;
  holdHeight: number;
};

export const HoldMenuBackdrop = memo(function HoldMenuBackdrop({
  fadeHeight,
  holdHeight,
}: THoldMenuBackdrop) {
  const { palette, scheme } = useAppTheme();
  const { height: windowHeight } = useWindowDimensions();
  const blurTint = BLUR_TINT[scheme];
  const riseHeight = fadeHeight + holdHeight;

  return (
    <View style={styles.root}>
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={styles.anchor}
        contentContainerStyle={{ height: windowHeight * 3 }}
        contentOffset={{ x: 0, y: windowHeight }}
      />
      <View style={styles.column}>
        <ProgressiveBlurView
          edge="bottom"
          intensity={BLUR_INTENSITY}
          startOffset={holdHeight / riseHeight}
          tint={blurTint}
          tintColor={palette.holdMenuWash}
          scrollFallback={false}
          style={{ height: riseHeight }}
        />
        <View style={styles.fall}>
          <ProgressiveBlurView
            edge="top"
            intensity={BLUR_INTENSITY}
            tint={blurTint}
            tintColor={palette.holdMenuWash}
            scrollFallback={false}
            style={StyleSheet.absoluteFill}
          />
          {HAS_FROST && (
            <LinearGradient
              colors={[
                palette.holdMenuSeamPeak,
                palette.holdMenuSeamMid,
                palette.holdMenuSeamSoft,
                palette.holdMenuSeam,
              ]}
              locations={[0, 0.35, 0.7, 1]}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>
      </View>
      <LinearGradient
        colors={[
          palette.holdMenuSeam,
          palette.holdMenuSeamSoft,
          palette.holdMenuSeamMid,
          palette.holdMenuSeamPeak,
          palette.holdMenuSeamMid,
          palette.holdMenuSeamSoft,
          palette.holdMenuSeam,
        ]}
        locations={[0, 0.2, 0.38, 0.5, 0.62, 0.8, 1]}
        style={[styles.seam, { top: riseHeight - SEAM_FADE, height: SEAM_FADE * 2 }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  anchor: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  column: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  fall: {
    flex: 0.6,
  },
  seam: {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
});
