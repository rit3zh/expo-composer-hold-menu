import type { DARK_PALETTE } from '../constants/colors.constants';

type TColorScheme = 'light' | 'dark';

type TPalette = Readonly<Record<keyof typeof DARK_PALETTE, string>>;

export type { TColorScheme, TPalette };
