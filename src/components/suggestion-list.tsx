import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ImageIcon, PencilIcon, WaveformIcon } from '../icons';
import { SuggestionItem, type TSuggestion } from './suggestion-item';

const SUGGESTIONS: TSuggestion[] = [
  { id: 'voice-chat', label: 'Start a voice chat', icon: WaveformIcon },
  { id: 'create-image', label: 'Create an image', icon: ImageIcon },
  { id: 'write-or-edit', label: 'Write or edit', icon: PencilIcon },
];

type TSuggestionList = {
  suggestions?: readonly TSuggestion[];
  onSuggestionPress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const SuggestionList = memo(function SuggestionList({
  suggestions = SUGGESTIONS,
  onSuggestionPress,
  style,
}: TSuggestionList) {
  return (
    <View style={[styles.container, style]}>
      {suggestions.map((suggestion) => (
        <SuggestionItem key={suggestion.id} suggestion={suggestion} onPress={onSuggestionPress} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
});
