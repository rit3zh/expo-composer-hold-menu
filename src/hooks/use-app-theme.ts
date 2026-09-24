import { useColorScheme } from 'react-native';

import { themes, type TTheme } from '../constants';

export function useAppTheme(): TTheme {
  return useColorScheme() === 'light' ? themes.light : themes.dark;
}
