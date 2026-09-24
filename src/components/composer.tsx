import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import {
  COMPOSER_LAYOUT,
  COMPOSER_SHELF,
  HOLD_MENU_LAYOUT,
  typography,
  type TPalette,
} from '../constants';
import { useAppTheme, useRecentPhotos, useThemedStyles } from '../hooks';
import { MicrophoneIcon, WaveformIcon } from '../icons';
import type { TRecentPhoto } from '../types';
import { AttachHoldButton } from './attach-hold-button';
import { AttachmentCard } from './attachment-card';
import { GlassSurface } from './glass-surface';
import { IconButton } from './icon-button';

const SHELF_OPEN_HEIGHT =
  COMPOSER_SHELF.EDGE_INSET + COMPOSER_SHELF.CARD_SIZE + COMPOSER_SHELF.ROW_SPACING;
const SHELF_SPRING = { duration: 320, dampingRatio: 1 };
const SHELF_COLLAPSE_DELAY = 90;
const FOCUS_SPRING = { duration: 380, dampingRatio: 1 };
const NO_IDS: ReadonlySet<string> = new Set();

type TComposer = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder'> & {
  recentPhotos?: readonly TRecentPhoto[];
  onAttachPress?: () => void;
  onPhotoSelect?: (photo: TRecentPhoto) => void;
  onDictatePress?: () => void;
  onVoicePress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Composer({
  value,
  onChangeText,
  placeholder = 'Ask ChatGPT',
  recentPhotos,
  onAttachPress,
  onPhotoSelect,
  onDictatePress,
  onVoicePress,
  style,
}: TComposer) {
  const { palette, scheme } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const galleryPhotos = useRecentPhotos(HOLD_MENU_LAYOUT.MAX_TILES);
  const photos = recentPhotos ?? galleryPhotos;

  const [cards, setCards] = useState<TRecentPhoto[]>([]);
  const [leavingIds, setLeavingIds] = useState(NO_IDS);
  const cardSerial = useRef(0);

  const pendingCard = useSharedValue(-1);
  const dockProgress = useSharedValue(0);
  const dock = useMemo(() => ({ pendingCard, dockProgress }), [dockProgress, pendingCard]);

  const shelfReveal = useSharedValue(0);
  const focus = useSharedValue(0);

  const isShelfOpen = cards.some((card) => !leavingIds.has(card.id));

  useEffect(() => {
    const reveal = withSpring(isShelfOpen ? 1 : 0, SHELF_SPRING);
    shelfReveal.set(isShelfOpen ? reveal : withDelay(SHELF_COLLAPSE_DELAY, reveal));
  }, [isShelfOpen, shelfReveal]);

  const addCard = useCallback(
    (photo: TRecentPhoto) => {
      cardSerial.current += 1;
      const card = { id: `${photo.id}#${cardSerial.current}`, uri: photo.uri };
      setCards((current) =>
        current.length < COMPOSER_SHELF.MAX_CARDS ? [...current, card] : current
      );
      onPhotoSelect?.(photo);
    },
    [onPhotoSelect]
  );

  const removeCard = useCallback((id: string) => {
    setLeavingIds((current) => new Set(current).add(id));
  }, []);

  const dropCard = useCallback((id: string) => {
    setCards((current) => current.filter((card) => card.id !== id));
    setLeavingIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const widthStyle = useAnimatedStyle(() => ({
    marginHorizontal: interpolate(focus.get(), [0, 1], [34, 18]),
  }));

  const shelfStyle = useAnimatedStyle(() => ({
    height: shelfReveal.get() * SHELF_OPEN_HEIGHT,
  }));

  return (
    <Animated.View style={[widthStyle, style]}>
      <GlassSurface style={styles.bar} isInteractive>
        <Animated.View style={[styles.shelf, shelfStyle]}>
          <View collapsable={false} style={styles.cardRow}>
            {cards.map((card, index) => (
              <AttachmentCard
                key={card.id}
                photo={card}
                index={index}
                dock={dock}
                isLeaving={leavingIds.has(card.id)}
                onRemove={removeCard}
                onExited={dropCard}
              />
            ))}
          </View>
        </Animated.View>
        <View style={styles.row}>
          <AttachHoldButton
            photos={photos}
            dock={dock}
            attachmentCount={cards.length}
            onPress={onAttachPress}
            onPhotoSelect={addCard}
          />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={() => focus.set(withSpring(1, FOCUS_SPRING))}
            onBlur={() => focus.set(withSpring(0, FOCUS_SPRING))}
            placeholder={placeholder}
            placeholderTextColor={palette.composerPlaceholder}
            selectionColor={palette.voiceButton}
            cursorColor={palette.voiceButton}
            keyboardAppearance={scheme}
            style={styles.input}
          />
          <IconButton
            icon={MicrophoneIcon}
            glassEffectStyle="none"
            size={COMPOSER_LAYOUT.ACTION_SIZE}
            iconSize={COMPOSER_LAYOUT.ICON_SIZE}
            iconColor={palette.composerIcon}
            hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
            accessibilityLabel="Dictate"
            onPress={onDictatePress}
          />
          <IconButton
            icon={WaveformIcon}
            size={COMPOSER_LAYOUT.ACTION_SIZE}
            iconSize={22}
            iconColor={palette.voiceIcon}
            iconStrokeWidth={2.18}
            hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
            accessibilityLabel="Start voice mode"
            onPress={onVoicePress}
            tintColor={palette.voiceButton}
            style={styles.voiceButton}
            fallbackStyle={styles.voiceButtonFallback}
          />
        </View>
      </GlassSurface>
    </Animated.View>
  );
}

const createStyles = (palette: TPalette) =>
  StyleSheet.create({
    bar: {
      borderRadius: COMPOSER_LAYOUT.HEIGHT / 2,
      borderWidth: COMPOSER_LAYOUT.BORDER_WIDTH,
      borderColor: palette.composerBorder,
      backgroundColor: palette.composerBackground,
    },
    shelf: {
      overflow: 'hidden',
      borderTopLeftRadius: COMPOSER_LAYOUT.HEIGHT / 2 - COMPOSER_LAYOUT.BORDER_WIDTH,
      borderTopRightRadius: COMPOSER_LAYOUT.HEIGHT / 2 - COMPOSER_LAYOUT.BORDER_WIDTH,
      borderCurve: 'continuous',
    },
    cardRow: {
      position: 'absolute',
      left: COMPOSER_SHELF.EDGE_INSET,
      bottom: COMPOSER_SHELF.ROW_SPACING,
      flexDirection: 'row',
      gap: COMPOSER_SHELF.CARD_SPACING,
    },
    row: {
      height: COMPOSER_LAYOUT.HEIGHT - COMPOSER_LAYOUT.BORDER_WIDTH * 2,
      paddingHorizontal: COMPOSER_LAYOUT.PADDING,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      ...typography.body,
      flex: 1,
      alignSelf: 'stretch',
      marginHorizontal: 9,
      padding: 0,
      paddingBottom: 2,
      color: palette.composerText,
    },
    voiceButton: {
      marginLeft: 16,
    },
    voiceButtonFallback: {
      backgroundColor: palette.voiceButton,
    },
  });
