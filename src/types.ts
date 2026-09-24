import type { ComponentType } from 'react';
import type { SharedValue } from 'react-native-reanimated';

export type TIcon = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export type TIconComponent = ComponentType<TIcon>;

export type TRecentPhoto = {
  id: string;
  uri: string;
};

export type TComposerDock = {
  pendingCard: SharedValue<number>;
  dockProgress: SharedValue<number>;
};

export type THoldMenuState = {
  anchorX: SharedValue<number>;
  anchorY: SharedValue<number>;
  open: SharedValue<number>;
  isOpen: SharedValue<boolean>;
  hovered: SharedValue<number>;
  dockingIndex: SharedValue<number>;
};
