import type { TColorScheme, TPalette } from '../types/theme.types';

interface IAppTheme {
  scheme: TColorScheme;
  isDark: boolean;
  palette: TPalette;
}

export type { IAppTheme };
