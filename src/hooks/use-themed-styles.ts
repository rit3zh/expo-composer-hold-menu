import { useMemo } from 'react';

import type { TPalette } from '../constants';
import { useAppTheme } from './use-app-theme';

export function useThemedStyles<T>(createStyles: (palette: TPalette) => T): T {
  const { palette } = useAppTheme();
  return useMemo(() => createStyles(palette), [createStyles, palette]);
}
