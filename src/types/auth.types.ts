import type { AUTH_BUTTON_VARIANTS } from '../constants/auth.constants';

type TAuthButtonVariant = (typeof AUTH_BUTTON_VARIANTS)[keyof typeof AUTH_BUTTON_VARIANTS];

export type { TAuthButtonVariant };
